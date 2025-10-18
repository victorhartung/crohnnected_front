"use client";

import { useLanguage } from "@/components/language-provider";
import React from "react";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="main-title mb-4">{t("terms.title")}</h1>
      <p className="max-w-none main-text mb-6 mt-2">{t("terms.description")}</p>

      <section className="prose">
        <h2 className="text-base md:text-xl main-title">
          {t("terms.acceptance")}
        </h2>
        <p className="max-w-none main-text mb-6 mt-2">
          {t("terms.acceptanceDesc")}
        </p>

        <h2 className="text-base md:text-xl main-title">
          {t("terms.userObligations")}
        </h2>
        <p className="max-w-none main-text mb-6 mt-2">
          {t("terms.userObligationsDesc")}
        </p>

        <h2 className="text-base md:text-xl main-title">
          {t("terms.limitation")}
        </h2>
        <p className="max-w-none main-text mb-6 mt-2">
          {t("terms.limitationDesc")}
        </p>
      </section>
    </main>
  );
}
