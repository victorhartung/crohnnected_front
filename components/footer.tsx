
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-header mt-auto supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Crohnnected</h3>
            <p className="text-sm text-muted-foreground">
              A comprehensive healthcare platform for Crohn's disease patients, doctors, and researchers.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">For Patients</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/reports/new" className="hover:underline">Submit Report</Link></li>
              <li><Link href="/reports" className="hover:underline">My Reports</Link></li>
              <li><Link href="/hub" className="hover:underline">Educational Hub</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">For Healthcare</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/reports" className="hover:underline">Review Reports</Link></li>
              <li><Link href="/hub" className="hover:underline">Clinical Resources</Link></li>
              <li><Link href="/map" className="hover:underline">Geographic Data</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/buy-me-coffee" className="hover:underline">Buy me a coffee</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Crohnnected. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
