"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { UserRole } from "@prisma/client";
import { useUIStore } from "@/store/ui-store";
import Image from "next/image"
import Logo from "@/public/images/logo.png"

export function Header() {
  const { data: session, status } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    if (status !== "authenticated" || !session?.user) {
      return [];
    }

    const baseItems = [{ label: "Home", href: "/" }];

    const roleItems: Record<
      UserRole,
      Array<{ label: string; href: string }>
    > = {
      PATIENT: [
        { label: "My Reports", href: "/reports" },
        { label: "New Report", href: "/reports/new" },
        { label: "Hub", href: "/hub" },
        { label: "Map", href: "/map" },
      ],
      DOCTOR: [
        { label: "Reports", href: "/reports" },
        { label: "Hub", href: "/hub" },
        { label: "Map", href: "/map" },
      ],
      RESEARCHER: [
        { label: "Reports", href: "/reports" },
        { label: "Hub", href: "/hub" },
        { label: "Map", href: "/map" },
      ],
      MODERATOR: [
        { label: "Reports", href: "/reports" },
        { label: "Hub", href: "/hub" },
        { label: "Map", href: "/map" },
        { label: "Admin", href: "/admin" },
      ],
      ADMIN: [
        { label: "Reports", href: "/reports" },
        { label: "Hub", href: "/hub" },
        { label: "Map", href: "/map" },
        { label: "Admin", href: "/admin" },
      ],
    };

    return [...baseItems, ...roleItems[session.user.role]];
  };

  const navItems = getNavItems();

  if (status === "loading") {
    return (
      <header className="border-b bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold">
                     <Image
                        src={Logo}
                        alt="Crohnnected Logo"
                        width={150}
                        height={70}
                        priority
                      />           
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              <Image
                src={Logo}
                alt="Crohnnected Logo"
                width={150}
                height={70}
                priority
              /> 
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {session.user.role}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {session.user.name?.charAt(0)?.toUpperCase() ||
                            session.user.email?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && session?.user && (
          <nav className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
