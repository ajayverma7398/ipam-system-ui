"use client";

import {
  GeneralSettingsForm,
  SiteConfiguration,
  NotificationSettings,
  ThemeSettings,
} from "@/components/settings";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function GeneralSettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="space-y-6">
        <SiteConfiguration />
        <GeneralSettingsForm />
        <NotificationSettings />
        <ThemeSettings />
      </div>
    </div>
  );
}

