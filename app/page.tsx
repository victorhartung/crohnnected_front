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
                  <h3 className="card-title">Submit New Report</h3>
                  <p className="card-text flex-grow">
                    Share your health information and attach supporting
                    documents.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/reports/new">Create Report</Link>
                  </Button>
                </Card>
              )}
              <Card className="p-6 w-80 flex flex-col">
                <FileText className="card-icons" />
                <h3 className="card-title">My Reports</h3>
                <p className="card-text flex-grow">
                  View and manage your submitted reports and their status.
                </p>
                <Button variant="default" asChild className="mt-4">
                  <Link href="/reports">View Reports</Link>
                </Button>
              </Card>
              <Card className="p-6 w-80 flex flex-col">
                <MapPin className="card-icons" />
                <h3 className="card-title">Geographic Data</h3>
                <p className="card-text">
                  Explore geographic patterns and patient distribution.
                </p>
                <Button variant="default" asChild className="mt-4">
                  <Link href="/map">View Map</Link>
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
              <h3 className="card-title">Review Reports</h3>
              <p className="card-text">
                Review patient submissions and approve or reject reports.
              </p>
              <Button asChild>
                <Link href="/reports">Review Reports</Link>
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
              <h3 className="card-title">Analyze Data</h3>
              <p className="card-text">
                Access approved reports and export data for research.
              </p>
              <Button asChild>
                <Link href="/reports">View Data</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="card-icons" />
              <h3 className="card-title">Geographic Insights</h3>
              <p className="card-text">
                Explore disease patterns and incidence data by location.
              </p>
              <Button variant="outline" asChild>
                <Link href="/map">Explore Map</Link>
              </Button>
            </Card>
          </div>
        );

      default:
        return (
          <div className="div-cards">
            <Card className="p-6">
              <FileText className="card-icons" />
              <h3 className="card-title">Manage Reports</h3>
              <p className="card-text">
                Oversee all reports and manage platform content.
              </p>
              <Button variant="default" asChild>
                <Link href="/reports">Manage Reports</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <Users className="card-icons" />
              <h3 className="card-title">Hub Management</h3>
              <p className="card-text">
                Manage educational content and community resources.
              </p>
              <Button variant="default" asChild>
                <Link href="/hub">Manage Hub</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <MapPin className="card-icons" />
              <h3 className="card-title">Analytics</h3>
              <p className="card-text">
                View platform analytics and geographic insights.
              </p>
              <Button variant="default" asChild>
                <Link href="/map">View Analytics</Link>
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
              Hello, {session.user.name || session.user.email}
            </span>
          )}
        </h1>
        <p className="main-text">{t("home.subtitle")}</p>
        {session?.user && (
          <Badge variant="account" className="text-sm">
            {session.user.role} Account
          </Badge>
        )}
      </div>

      <div className="max-w-4xl mx-auto">{getRoleSpecificContent()}</div>

      <div className="stats-alignment">
        <div className="stats">
          <div>
            <h4 className="stat-title">Secure</h4>
            <p className="stat-text">
              HIPAA-compliant platform with end-to-end encryption
            </p>
          </div>
          <div>
            <h4 className="stat-title">Collaborative</h4>
            <p className="stat-text">
              Connecting patients, doctors, and researchers worldwide
            </p>
          </div>
          <div>
            <h4 className="stat-title">Impactful</h4>
            <p className="stat-text">
              Contributing to better understanding of Crohn&apos;s disease
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
