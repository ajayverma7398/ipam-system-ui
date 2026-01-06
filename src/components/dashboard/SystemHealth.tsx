"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";

interface HealthIndicator {
  label: string;
  status: "healthy" | "warning" | "error";
  value?: string;
  details?: string;
}

interface SystemHealthProps {
  health?: HealthIndicator[];
}

export function SystemHealth({ health: initialHealth }: SystemHealthProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicator[]>(
    initialHealth || [
      {
        label: "API Status",
        status: "healthy",
        value: "Operational",
      },
      {
        label: "Database",
        status: "healthy",
        value: "Connected",
      },
      {
        label: "DHCP Integration",
        status: "healthy",
        value: "Active",
      },
      {
        label: "DNS Integration",
        status: "healthy",
        value: "Active",
      },
      {
        label: "Monitoring",
        status: "warning",
        value: "Degraded",
        details: "Response time increased",
      },
      {
        label: "Storage Usage",
        status: "healthy",
        value: "45%",
        details: "2.4 GB / 5.3 GB used",
      },
    ]
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLastRefresh(new Date());
    }, 0);
  }, []);

  const refreshHealth = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">System Health</h3>
          <p className="text-xs text-slate-500 mt-1" suppressHydrationWarning>
            Last checked: {lastRefresh ? lastRefresh.toLocaleTimeString() : "—"}
          </p>
        </div>
        <button
          onClick={refreshHealth}
          disabled={isRefreshing}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Refresh health status"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? "Checking..." : "Refresh"}
        </button>
      </div>
      <div className="space-y-3">
        {healthIndicators.map((indicator) => (
          <div key={indicator.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(indicator.status)}`} />
              <div className="flex-1">
                <span className="text-sm font-medium text-slate-900">{indicator.label}</span>
                {indicator.details && (
                  <p className="text-xs text-slate-500 mt-0.5">{indicator.details}</p>
                )}
              </div>
            </div>
            {indicator.value && (
              <span className={`text-sm font-medium ${getStatusTextColor(indicator.status)}`}>
                {indicator.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
