"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface ReportContextType {
  reportVersion: number;
  refreshReports: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [reportVersion, setReportVersion] = useState(0);

  const refreshReports = useCallback(() => {
    setReportVersion((prev) => prev + 1);
  }, []);

  return (
    <ReportContext.Provider value={{ reportVersion, refreshReports }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReportContext must be used within a ReportProvider");
  }
  return context;
}
