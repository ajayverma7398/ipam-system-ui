import reportHistoryData from "./report-history.json";

export interface ReportExecution {
  id: string;
  scheduleId: string;
  scheduleName: string;
  reportType: string;
  status: "success" | "failed" | "running";
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  recipients: number;
  formats: string[];
  error: string | null;
  fileSize: number | null;
}

export interface ReportHistoryData {
  executions: ReportExecution[];
}

export const reportHistory = reportHistoryData as ReportHistoryData;

