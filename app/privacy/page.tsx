import React from 'react'

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="main-title mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">This is a placeholder Privacy Policy for Crohnnected. Replace with your official policy text before going to production.</p>

      <section className="prose">
        <h2 className='text-base md:text-xl main-title'>Information we Collect</h2>
        <p className='max-w-none main-text mb-6 mt-2'>We collect information necessary to provide the service, including account information, reports submitted by patients, and content created on the platform.</p>

        <h2 className='text-base md:text-xl main-title'>How we Use Information</h2>
        <p className='max-w-none main-text mb-6 mt-2'>Data is used to provide and improve services, to communicate with users, and for research purposes when explicitly consented.</p>

        <h2 className='text-base md:text-xl main-title'>Data Retention</h2>
        <p className='max-w-none main-text mb-6 mt-2'>We retain personal data only as long as necessary to provide the services and comply with legal obligations.</p>

        <h2 className='text-base md:text-xl main-title'>Contact</h2>
        <p className='max-w-none main-text mb-6 mt-2'>If you have questions about privacy, please visit the <a href="/contact" className="underline font-semibold">Contact</a> page.</p>
      </section>
    </main>
  )
}
