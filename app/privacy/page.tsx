import React from "react";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="main-title mb-4">{t("privacy.title")}</h1>
      <p className="text-muted-foreground mb-4">{t("privacy.description")}</p>

      <section className="prose">
        <h2 className="text-base md:text-xl main-title">
          {t("privacy.infoWeCollect")}
        </h2>
        <p className="max-w-none main-text mb-6 mt-2">
          {t("privacy.infoWeCollectDesc")}
        </p>

        <h2 className="text-base md:text-xl main-title">
          {t("privacy.howWeUse")}
        </h2>
        <p className="max-w-none main-text mb-6 mt-2">
          {t("privacy.howWeUseDesc")}
        </p>

        <h2 className="text-base md:text-xl main-title">
          {t("privacy.dataRetention")}
        </h2>
        <p className="max-w-none main-text mb-6 mt-2">
          {t("privacy.dataRetentionDesc")}
        </p>

        <h2 className="text-base md:text-xl main-title">
          {t("privacy.contactTitle")}
        </h2>
        <p className="max-w-none main-text mb-6 mt-2">
          {t("privacy.contactDesc", {
            link: `<a href="/contact" class="underline">${t(
              "privacy.contactLink"
            )}</a>`,
          })}
        </p>
      </section>
    </main>
  );
}
