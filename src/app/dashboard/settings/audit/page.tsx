"use client";

import {
  AuditConfiguration,
  LogSettings,
  ComplianceSettings,
  BackupSettings,
} from "@/components/settings";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function AuditSettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="space-y-6">
        <AuditConfiguration />
        <LogSettings />
        <ComplianceSettings />
        <BackupSettings />
      </div>
    </div>
  );
}

