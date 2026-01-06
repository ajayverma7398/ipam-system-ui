"use client";

import {
  NetworkConfiguration,
  DNSSettings,
  DHCPSettings,
  RoutingSettings,
} from "@/components/settings";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function NetworkSettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <div className="space-y-6">
        <NetworkConfiguration />
        <DNSSettings />
        <DHCPSettings />
        <RoutingSettings />
      </div>
    </div>
  );
}

