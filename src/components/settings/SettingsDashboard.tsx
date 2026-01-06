"use client";

import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

interface SettingsCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  status: "configured" | "needs_attention" | "default";
  count?: number;
}

export function SettingsDashboard() {
  const router = useRouter();

  const categories: SettingsCategory[] = [
    {
      id: "general",
      title: "General Settings",
      description: "System name, default preferences, and basic configuration",
      icon: "⚙️",
      route: "/dashboard/settings/general",
      status: "configured",
    },
    {
      id: "network",
      title: "Network Configuration",
      description: "DNS servers, NTP servers, default gateway settings",
      icon: "🌐",
      route: "/dashboard/settings/network",
      status: "configured",
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "DHCP, DNS, monitoring, and API integrations",
      icon: "🔌",
      route: "/dashboard/settings/integrations",
      status: "needs_attention",
      count: 2,
    },
    {
      id: "users",
      title: "User Management",
      description: "Users, roles, permissions, and access control",
      icon: "👥",
      route: "/dashboard/settings/users",
      status: "configured",
      count: 12,
    },
    {
      id: "api",
      title: "API Settings",
      description: "API keys, rate limits, authentication, and endpoints",
      icon: "🔑",
      route: "/dashboard/settings/api",
      status: "configured",
    },
    {
      id: "audit",
      title: "Audit & Logging",
      description: "Audit logs, retention policies, and compliance settings",
      icon: "📋",
      route: "/dashboard/settings/audit",
      status: "configured",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string; label: string }> = {
      configured: { bg: "bg-green-100", text: "text-green-800", label: "Configured" },
      needs_attention: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Needs Attention" },
      default: { bg: "bg-slate-100", text: "text-slate-800", label: "Default" },
    };
    const config = statusColors[status] || statusColors.default;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Settings Categories</h3>
          <p className="text-sm text-slate-600">Manage system configuration and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(category.route)}
              className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                      {category.title}
                    </h4>
                    {category.count !== undefined && (
                      <p className="text-xs text-slate-500 mt-1">{category.count} items</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(category.status)}
              </div>
              <p className="text-xs text-slate-600">{category.description}</p>
              <div className="mt-3 flex items-center text-xs text-blue-600 group-hover:text-blue-700">
                <span>Configure</span>
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

