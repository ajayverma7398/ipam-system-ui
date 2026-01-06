"use client";

import {
  ReportDashboard,
  QuickReports,
  SavedReports,
  ScheduledReports,
  ReportTemplates,
} from "@/components/reports";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="flex-1 overflow-y-auto space-y-6">
          <ReportDashboard />

          <QuickReports />

          <SavedReports />

          <ScheduledReports />

          <ReportTemplates />
        </div>
      </div>
  );
}
