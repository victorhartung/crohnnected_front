export interface Report {
  id: string;
  ageAtReport?: number;
  sex?: string;
  country: string;
  state?: string;
  city?: string;
  symptoms: string[];
  symptomSeverity: string;
  medications?: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt?: string;
  approvedBy?: {
    name?: string;
    email: string;
  };
  rejectionReason?: string;
  hasDocument: boolean;
  documentOriginalName?: string;
  documentSizeBytes?: number;
  notes?: string;
}
