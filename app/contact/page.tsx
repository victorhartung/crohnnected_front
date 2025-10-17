import React from 'react'

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>
      <p className="text-muted-foreground mb-4">Have questions or feedback? Use the form below to send us a message.</p>

      <form className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 block w-full rounded-md border px-3 py-2 text-sm bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60" placeholder="Your name" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 block w-full rounded-md border px-3 py-2 text-sm bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60" placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea className="mt-1 block w-full rounded-md border px-3 py-2 text-sm bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60" rows={6} placeholder="Write your message here" />
        </div>

        <div>
          <button type="button" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">Send Message</button>
        </div>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">Or email us at <a href="mailto:contact@crohnnected.com" className="underline">contact@crohnnected.com</a>.</p>
    </main>
  )
}
