"use client";

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Report } from "@/interfaces/report";
import LogoHome from "@/public/images/logo-home.png";
import { BarChart3, FileText, MapPin, Plus, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();

  const [hasActiveReport, setHasActiveReport] = useState(false);

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
  }, [session, status]);

  const getRoleSpecificContent = () => {
    if (status === "loading") return null;

    if (status === "unauthenticated") {
      return (
        <div className="div-cards">
          <Card className="p-6">
            <FileText className="card-icons" />
            <h3 className="card-title">{t("home.forPatientsTitle")}</h3>
            <p className="card-text">{t("home.subtitle")}</p>
            <Button asChild>
              <Link href="/register">{t("home.getStarted")}</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <Users className="card-icons" />
            <h3 className="card-title">{t("home.forDoctorsTitle")}</h3>
            <p className="card-text">{t("home.subtitle")}</p>
            <Button asChild>
              <Link href="/login">{t("home.signIn")}</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <BarChart3 className="card-icons" />
            <h3 className="card-title">{t("home.forResearchersTitle")}</h3>
            <p className="card-text">{t("home.subtitle")}</p>
            <Button asChild>
              <Link href="/register">{t("home.joinNow")}</Link>
            </Button>
          </Card>
        </div>
      );
    }

    const role = session?.user?.role;

    switch (role) {
      case "PATIENT":
        return (
          <div className="flex justify-center items-start min-h-[400px]">
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              {!hasActiveReport && (
                <Card className="p-6 w-80 flex flex-col">
                  <Plus className="card-icons" />
                  <h3 className="card-title">{t("home.submitNewReport")}</h3>
                  <p className="card-text flex-grow">
                    {t("home.submitNewReportDesc")}
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/reports/new">{t("home.createReport")}</Link>
                  </Button>
                </Card>
              )}
              <Card className="p-6 w-80 flex flex-col">
                <FileText className="card-icons" />
                <h3 className="card-title">{t("home.myReportsTitle")}</h3>
                <p className="card-text flex-grow">
                  {t("home.myReportsDesc")}
                </p>
                <Button variant="default" asChild className="mt-4">
                  <Link href="/reports">{t("home.viewReports")}</Link>
                </Button>
              </Card>
              <Card className="p-6 w-80 flex flex-col">
                <MapPin className="card-icons" />
                <h3 className="card-title">{t("home.geographicData")}</h3>
                <p className="card-text">
                  {t("home.geographicDataDesc")}
                </p>
                <Button variant="default" asChild className="mt-4">
                  <Link href="/map">{t("home.viewMap")}</Link>
                </Button>
              </Card>
            </div>
          </div>
        );

      case "DOCTOR":
        return (
          <div className="div-cards">
            <Card className="p-6">
              <FileText className="card-icons" />
              <h3 className="card-title">{t("home.reviewReports")}</h3>
              <p className="card-text">
                {t("home.reviewReportsDesc")}
              </p>
              <Button asChild>
                <Link href="/reports">{t("home.reviewReports")}</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="card-icons" />
              <h3 className="card-title">Geographic Data</h3>
              <p className="card-text">
                Explore geographic patterns and patient distribution.
              </p>
              <Button variant="default" asChild>
                <Link href="/map">View Map</Link>
              </Button>
            </Card>
          </div>
        );

      case "RESEARCHER":
        return (
          <div className="div-cards">
            <Card className="p-6">
              <BarChart3 className="card-icons" />
              <h3 className="card-title">{t("home.analyzeData")}</h3>
              <p className="card-text">
                {t("home.analyzeDataDesc")}
              </p>
              <Button asChild>
                <Link href="/reports">{t("home.viewData")}</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="card-icons" />
              <h3 className="card-title">{t("home.geographicInsights")}</h3>
              <p className="card-text">
                {t("home.geographicInsightsDesc")}
              </p>
              <Button variant="outline" asChild>
                <Link href="/map">{t("home.exploreMap")}</Link>
              </Button>
            </Card>
          </div>
        );

      default:
        return (
          <div className="div-cards">
            <Card className="p-6">
              <FileText className="card-icons" />
              <h3 className="card-title">{t("home.manageReports")}</h3>
              <p className="card-text">
                {t("home.manageReportsDesc")}
              </p>
              <Button variant="default" asChild>
                <Link href="/reports">{t("home.manageReports")}</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <Users className="card-icons" />
              <h3 className="card-title">{t("home.hubManagement")}</h3>
              <p className="card-text">
                {t("home.hubManagementDesc")}
              </p>
              <Button variant="default" asChild>
                <Link href="/hub">{t("home.manageHub")}</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="card-icons" />
              <h3 className="card-title">{t("home.analytics")}</h3>
              <p className="card-text">
                {t("home.analyticsDesc")}
              </p>
              <Button variant="default" asChild>
                <Link href="/map">{t("home.viewAnalytics")}</Link>
              </Button>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="main-container">
      <div className="main-alignment">
        <h1 className="main-title">
          {t("home.welcome")}
          <Image
            src={LogoHome}
            alt="Crohnnected Logo"
            width={440}
            height={360}
            priority
            className="mx-auto"
          />
          {session?.user && (
            <span className="main-subtitle-name">
              {t("home.helloUser", { name: session.user.name || session.user.email })}
            </span>
          )}
        </h1>
        <p className="main-text">{t("home.subtitle")}</p>
        {session?.user && (
          <Badge variant="account" className="text-sm">
            {t("home.accountBadge", { role: session.user.role })}
          </Badge>
        )}
      </div>

      <div className="max-w-4xl mx-auto">{getRoleSpecificContent()}</div>

      <div className="stats-alignment">
        <div className="stats">
          <div>
            <h4 className="stat-title">{t("home.secureTitle")}</h4>
            <p className="stat-text">
              {t("home.secureDesc")}
            </p>
          </div>
          <div>
            <h4 className="stat-title">{t("home.collaborativeTitle")}</h4>
            <p className="stat-text">
              {t("home.collaborativeDesc")}
            </p>
          </div>
          <div>
            <h4 className="stat-title">{t("home.impactfulTitle")}</h4>
            <p className="stat-text">
              {t("home.impactfulDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
