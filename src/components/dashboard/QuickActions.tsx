"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";

interface Action {
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  tooltip?: string;
}

export function QuickActions() {
  const router = useRouter();

  const actions: Action[] = [
    {
      label: "Create Pool",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: () => router.push("/dashboard/pools/create"),
      color: "bg-blue-50 hover:bg-blue-100 text-blue-600",
      tooltip: "Create a new IP address pool",
    },
    {
      label: "Allocate IP",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => router.push("/dashboard/ip-management/allocate"),
      color: "bg-blue-50 hover:bg-blue-100 text-blue-600",
      tooltip: "Allocate an IP address to a device",
    },
    {
      label: "Find IP",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      onClick: () => router.push("/dashboard/ip-management/find"),
      color: "bg-blue-50 hover:bg-blue-100 text-blue-600",
      tooltip: "Search for an IP address",
    },
    {
      label: "Generate Report",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => router.push("/dashboard/reports"),
      color: "bg-blue-50 hover:bg-blue-100 text-blue-600",
      tooltip: "Generate utilization and allocation reports",
    },
    {
      label: "CIDR Calculator",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => router.push("/dashboard/ip-management/calculator"),
      color: "bg-blue-50 hover:bg-blue-100 text-blue-600",
      tooltip: "Calculate CIDR network information",
    },
    {
      label: "Import/Export",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      onClick: () => router.push("/dashboard/settings?tab=import-export"),
      color: "bg-blue-50 hover:bg-blue-100 text-blue-600",
      tooltip: "Import or export IPAM data",
    },
  ];

  return (
    <>
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              title={action.tooltip}
              className={`w-full text-left px-4 py-3 ${action.color} rounded-lg transition-colors flex items-center justify-between group`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{action.label}</span>
                {action.shortcut && (
                  <span className="text-xs text-slate-500 bg-white/50 px-2 py-0.5 rounded font-mono">
                    {action.shortcut}
                  </span>
                )}
              </div>
              {action.icon}
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}
