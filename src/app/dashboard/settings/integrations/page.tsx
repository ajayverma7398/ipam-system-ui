"use client";

import {
  IntegrationDashboard,
  CMDBIntegration,
  MonitoringIntegration,
  CloudIntegration,
} from "@/components/settings";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function IntegrationSettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="space-y-6">
        <IntegrationDashboard />
        <CMDBIntegration />
        <MonitoringIntegration />
        <CloudIntegration />
      </div>
    </div>
  );
}

