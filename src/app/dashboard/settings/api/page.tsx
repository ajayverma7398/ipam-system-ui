"use client";

import {
  APIConfiguration,
  APIKeys,
  WebhookSettings,
  RateLimiting,
} from "@/components/settings";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function APISettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="space-y-6">
        <APIConfiguration />
        <APIKeys />
        <WebhookSettings />
        <RateLimiting />
      </div>
    </div>
  );
}

