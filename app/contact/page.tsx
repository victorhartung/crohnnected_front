import React from 'react'
import { useLanguage } from '@/components/language-provider'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">{t("contact.title")}</h1>
      <p className="text-muted-foreground mb-4">{t("contact.description")}</p>

      <form className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium">{t("contact.name")}</label>
          <input className="mt-1 block w-full rounded-md border px-3 py-2 text-sm bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60" placeholder={t("contact.namePlaceholder")} />
        </div>

        <div>
          <label className="block text-sm font-medium">{t("contact.email")}</label>
          <input className="mt-1 block w-full rounded-md border px-3 py-2 text-sm bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60" placeholder={t("contact.emailPlaceholder")} />
        </div>

        <div>
          <label className="block text-sm font-medium">{t("contact.message")}</label>
          <textarea className="mt-1 block w-full rounded-md border px-3 py-2 text-sm bg-header backdrop-blur supports-[backdrop-filter]:bg-white/60" rows={6} placeholder={t("contact.messagePlaceholder")} />
        </div>

        <div>
          <button type="button" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">{t("contact.sendMessage")}</button>
        </div>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">{t("contact.orEmail")} <a href="mailto:contact@crohnnected.com" className="underline">{t("contact.emailLink")}</a>.</p>
    </main>
  )
}
