"use client";

import {
  SettingsDashboard,
  SystemStatus,
  QuickSettings,
  RecentChanges,
} from "@/components/settings";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="space-y-6">
          <SettingsDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemStatus />
            <QuickSettings />
          </div>
          <RecentChanges />
        </div>
      </div>
  );
}

