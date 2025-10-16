import React from 'react'

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">{t("terms.title")}</h1>
      <p className="text-muted-foreground mb-4">{t("terms.description")}</p>

      <section className="prose">
        <h2>{t("terms.acceptance")}</h2>
        <p>{t("terms.acceptanceDesc")}</p>

        <h2>{t("terms.userObligations")}</h2>
        <p>{t("terms.userObligationsDesc")}</p>

        <h2>{t("terms.limitation")}</h2>
        <p>{t("terms.limitationDesc")}</p>
      </section>
    </main>
  )
}
