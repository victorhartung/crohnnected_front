
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import { verify, hash } from "argon2"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { UserRole } from "@prisma/client"
import jwt from "jsonwebtoken"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            patientProfile: true,
            doctorProfile: true,
          }
        })

        if (!user) {
          return null
        }

        const isValidPassword = await verify(user.passwordHash, credentials.password)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profile: user.patientProfile || user.doctorProfile || null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.profile = user.profile
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.profile = token.profile as any
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    newUser: "/register"
  }
}

// Additional auth utility functions for Session 1 API routes
export async function hashPassword(password: string): Promise<string> {
  return hash(password)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return verify(hashedPassword, password)
}

export function generateAccessToken(payload: any): string {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn: '1h' })
}

export function generateRefreshToken(payload: any): string {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!)
  } catch {
    return null
  }
}

// Rate limiting functions (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function checkRateLimit(key: string, maxRequests = 5, windowMs = 15 * 60 * 1000): Promise<boolean> {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export function getRateLimitKey(req: NextRequest, prefix: string): string {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  return `${prefix}:${ip}`
}

// Auth wrapper for API routes (compatible with Session 1 signature)
export function withAuth(handler: (req: NextRequest, user: any, context?: any) => Promise<Response>, allowedRoles?: UserRole[]) {
  return async (req: NextRequest, context?: any) => {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session || !session.user) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        return Response.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }

      // Convert session user to the expected User format
      const user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        profile: session.user.profile
      }

      return handler(req, user, context)
    } catch (error) {
      console.error('Auth wrapper error:', error)
      return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
  }
}
