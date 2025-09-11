'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, BarChart3, MapPin, Plus, Eye } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()

  const getRoleSpecificContent = () => {
    if (status === 'loading') {
      return null
    }

    if (status === 'unauthenticated') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">For Patients</h3>
            <p className="text-muted-foreground mb-4">
              Submit reports, manage your health data, and access educational resources.
            </p>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">For Doctors</h3>
            <p className="text-muted-foreground mb-4">
              Review patient reports, approve submissions, and access clinical protocols.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">For Researchers</h3>
            <p className="text-muted-foreground mb-4">
              Access anonymized data, export reports, and analyze trends.
            </p>
            <Button asChild>
              <Link href="/register">Join Now</Link>
            </Button>
          </Card>
        </div>
      )
    }

    const role = session?.user?.role
    
    switch (role) {
      case 'PATIENT':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Plus className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Submit New Report</h3>
              <p className="text-muted-foreground mb-4">
                Share your health information and attach supporting documents.
              </p>
              <Button asChild>
                <Link href="/reports/new">Create Report</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">My Reports</h3>
              <p className="text-muted-foreground mb-4">
                View and manage your submitted reports and their status.
              </p>
              <Button variant="outline" asChild>
                <Link href="/reports">View Reports</Link>
              </Button>
            </Card>
          </div>
        )
        
      case 'DOCTOR':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Reports</h3>
              <p className="text-muted-foreground mb-4">
                Review patient submissions and approve or reject reports.
              </p>
              <Button asChild>
                <Link href="/reports">Review Reports</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Geographic Data</h3>
              <p className="text-muted-foreground mb-4">
                Explore geographic patterns and patient distribution.
              </p>
              <Button variant="outline" asChild>
                <Link href="/map">View Map</Link>
              </Button>
            </Card>
          </div>
        )
        
      case 'RESEARCHER':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analyze Data</h3>
              <p className="text-muted-foreground mb-4">
                Access approved reports and export data for research.
              </p>
              <Button asChild>
                <Link href="/reports">View Data</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Geographic Insights</h3>
              <p className="text-muted-foreground mb-4">
                Explore disease patterns and incidence data by location.
              </p>
              <Button variant="outline" asChild>
                <Link href="/map">Explore Map</Link>
              </Button>
            </Card>
          </div>
        )
        
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Manage Reports</h3>
              <p className="text-muted-foreground mb-4">
                Oversee all reports and manage platform content.
              </p>
              <Button asChild>
                <Link href="/reports">Manage Reports</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hub Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage educational content and community resources.
              </p>
              <Button variant="outline" asChild>
                <Link href="/hub">Manage Hub</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground mb-4">
                View platform analytics and geographic insights.
              </p>
              <Button variant="outline" asChild>
                <Link href="/map">View Analytics</Link>
              </Button>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">
          Welcome to Crohnnected
          {session?.user && (
            <span className="block text-2xl text-muted-foreground mt-2">
              Hello, {session.user.name || session.user.email}
            </span>
          )}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A comprehensive healthcare platform connecting Crohn's disease patients, 
          doctors, and researchers to improve treatment outcomes and advance research.
        </p>
        {session?.user && (
          <Badge variant="outline" className="text-sm">
            {session.user.role} Account
          </Badge>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto">
        {getRoleSpecificContent()}
      </div>
      
      {/* Statistics or additional info */}
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-2xl font-bold text-primary">Secure</h4>
            <p className="text-muted-foreground">
              HIPAA-compliant platform with end-to-end encryption
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary">Collaborative</h4>
            <p className="text-muted-foreground">
              Connecting patients, doctors, and researchers worldwide
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary">Impactful</h4>
            <p className="text-muted-foreground">
              Contributing to better understanding of Crohn's disease
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}