
import { create } from 'zustand'
import { Report, ReportStatus, SymptomSeverity } from '@prisma/client'

interface ReportsFilter {
  status?: ReportStatus
  country?: string
  state?: string
  city?: string
  minAge?: number
  maxAge?: number
  symptoms?: string[]
  severity?: SymptomSeverity
  period?: string
}

interface ReportsStore {
  reports: Report[]
  currentReport: Report | null
  filters: ReportsFilter
  isLoading: boolean
  setReports: (reports: Report[]) => void
  setCurrentReport: (report: Report | null) => void
  updateFilters: (filters: Partial<ReportsFilter>) => void
  setLoading: (loading: boolean) => void
  addReport: (report: Report) => void
  updateReport: (reportId: string, updates: Partial<Report>) => void
}

export const useReportsStore = create<ReportsStore>((set, get) => ({
  reports: [],
  currentReport: null,
  filters: {},
  isLoading: false,
  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
  updateFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  setLoading: (isLoading) => set({ isLoading }),
  addReport: (report) => set({ reports: [report, ...get().reports] }),
  updateReport: (reportId, updates) => 
    set({ 
      reports: get().reports.map(r => r.id === reportId ? { ...r, ...updates } : r),
      currentReport: get().currentReport?.id === reportId 
        ? { ...get().currentReport!, ...updates } 
        : get().currentReport
    }),
}))
