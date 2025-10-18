import React from 'react'

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="main-title mb-4">Terms of Service</h1>
      <p className="max-w-none main-text mb-6 mt-2">This is a placeholder Terms of Service document. Replace with your full terms before publishing.</p>

      <section className="prose">
        <h2 className='text-base md:text-xl main-title'>Acceptance of Terms</h2>
        <p className='max-w-none main-text mb-6 mt-2'>By using Crohnnected you agree to these terms. Please read them carefully.</p>

        <h2 className='text-base md:text-xl main-title'>User Obligations</h2>
        <p className='max-w-none main-text mb-6 mt-2'>Users are responsible for providing accurate information and for maintaining the confidentiality of their account credentials.</p>

        <h2 className='text-base md:text-xl main-title'>Limitation of Liability</h2>
        <p className='max-w-none main-text mb-6 mt-2'>Crohnnected provides educational content and tools; it is not a substitute for professional medical advice.</p>
      </section>
    </main>
  )
}
