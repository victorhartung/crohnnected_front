import React from 'react'

function PixQr({ pixKey }: { pixKey: string }) {
  // Very small inline QR fallback: we won't generate a true QR here.
  // Provide a prominent box with the PIX key and a suggestion to use any PIX QR generator externally.
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-60 h-60 bg-white border flex items-center justify-center">
        {/* Placeholder box for QR — in production replace with a QR generator */}
        <div className="text-center text-sm px-2">QR Placeholder\n(Paste this PIX key into your banking app)</div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">PIX key:</p>
        <p className="font-mono break-all">{pixKey}</p>
      </div>
    </div>
  )
}

export default function BuyMeCoffeePage() {
  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || '';

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Buy me a coffee</h1>
      <p className="text-muted-foreground mb-6">If you'd like to support this project, you can make a small donation via PIX.</p>

      {pixKey ? (
        <PixQr pixKey={pixKey} />
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">No PIX key configured. To enable, set the environment variable <code>NEXT_PUBLIC_PIX_KEY</code> with your PIX identifier (email, phone or key).</p>
          <p className="text-sm">Once configured, this page will render a QR code for quick payments.</p>
        </div>
      )}

      <p className="mt-8 text-sm text-muted-foreground">Thank you for supporting Crohnnected.</p>
    </main>
  )
}
