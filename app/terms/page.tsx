import React from 'react'

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">This is a placeholder Terms of Service document. Replace with your full terms before publishing.</p>

      <section className="prose">
        <h2>Acceptance of terms</h2>
        <p>By using Crohnnected you agree to these terms. Please read them carefully.</p>

        <h2>User obligations</h2>
        <p>Users are responsible for providing accurate information and for maintaining the confidentiality of their account credentials.</p>

        <h2>Limitation of liability</h2>
        <p>Crohnnected provides educational content and tools; it is not a substitute for professional medical advice.</p>
      </section>
    </main>
  )
}
