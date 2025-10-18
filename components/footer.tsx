"use client";

import { Report } from "@/interfaces/report";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";
import { useReportContext } from "./report-context";

export function Footer() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [hasActiveReport, setHasActiveReport] = useState(false);
  const { reportVersion } = useReportContext();

  useEffect(() => {
    const checkActiveReport = async () => {
      if (session?.user?.role !== "PATIENT") {
        return;
      }

      try {
        const res = await fetch("/api/reports?limit=1");
        if (res.ok) {
          const data = await res.json();
          const activeReport = data?.data?.reports?.find(
            (report: Report) => report.status !== "REJECTED"
          );
          setHasActiveReport(!!activeReport);
        }
      } catch (error) {
        console.error("Error checking active report:", error);
      }
    };

    if (status === "authenticated") {
      checkActiveReport();
    }
  }, [session, status, reportVersion]);

  // Show patient links only to authenticated users with PATIENT role
  const isPatient =
    status === "authenticated" && session?.user?.role === "PATIENT";

  return (
    <footer className="border-t bg-header mt-auto supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t("footer.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          {isPatient && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">{t("footer.patients")}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {!hasActiveReport && (
                  <li>
                    <Link href="/reports/new" className="hover:underline">
                      {t("footer.submitReport")}
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/reports" className="hover:underline">
                    {t("footer.myReports")}
                  </Link>
                </li>
                <li>
                  <Link href="/hub" className="hover:underline">
                    {t("footer.educationalHub")}
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t("footer.healthcare")}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/reports" className="hover:underline">
                  {t("footer.reviewReports")}
                </Link>
              </li>
              <li>
                <Link href="/hub" className="hover:underline">
                  {t("footer.clinicalResources")}
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:underline">
                  {t("footer.geographicData")}
                </Link>
              </li>
              <li>
                <Link href="/contact/doctor" className="hover:underline">
                  {t("footer.contactDoctor")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t("footer.legal")}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:underline">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/buy-me-coffee" className="hover:underline">
                  {t("footer.coffee")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p
            dangerouslySetInnerHTML={{
              __html: t(
                "footer.copyright",
                "&copy; " +
                  new Date().getFullYear() +
                  " Crohnnected. All rights reserved."
              ).replace("{year}", new Date().getFullYear().toString()),
            }}
          />
        </div>
      </div>
    </footer>
  );
}
