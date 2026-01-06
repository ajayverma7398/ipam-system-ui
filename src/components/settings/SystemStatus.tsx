"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

interface ComponentStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: string;
  responseTime?: number;
}

interface ResourceUsage {
  cpu: number;
  memory: number;
  storage: number;
}

export function SystemStatus() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const components: ComponentStatus[] = [
    { name: "API Server", status: "healthy", uptime: "99.9%", responseTime: 45 },
    { name: "Database", status: "healthy", uptime: "100%", responseTime: 12 },
    { name: "DHCP Integration", status: "healthy", uptime: "99.8%", responseTime: 23 },
    { name: "DNS Integration", status: "degraded", uptime: "98.5%", responseTime: 156 },
    { name: "Monitoring", status: "healthy", uptime: "99.9%", responseTime: 34 },
  ];

  const resourceUsage: ResourceUsage = {
    cpu: 34,
    memory: 62,
    storage: 45,
  };

  const systemUptime = "45 days, 12 hours";
  const totalRequests = "1.2M";
  const avgResponseTime = "87ms";

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; dot: string; text: string }> = {
      healthy: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-800" },
      degraded: { bg: "bg-yellow-50", dot: "bg-yellow-500", text: "text-yellow-800" },
      down: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-800" },
    };
    return colors[status] || colors.healthy;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">System Status</h3>
            <p className="text-sm text-slate-600">Overall system health and performance metrics</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors flex items-center gap-2"
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
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">System Uptime</p>
            <p className="text-2xl font-bold text-blue-900">{systemUptime}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-green-900">{totalRequests}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Avg Response Time</p>
            <p className="text-2xl font-bold text-purple-900">{avgResponseTime}</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Component Status</h4>
          <div className="space-y-2">
            {components.map((component) => {
              const colors = getStatusColor(component.status);
              return (
                <div key={component.name} className={`p-3 ${colors.bg} border border-slate-200 rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${colors.dot} rounded-full`} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{component.name}</p>
                        <p className="text-xs text-slate-600">Uptime: {component.uptime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {component.responseTime && (
                        <span className="text-xs text-slate-600">
                          {component.responseTime}ms
                        </span>
                      )}
                      <span className={`text-xs font-medium ${colors.text}`}>
                        {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Resource Usage</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">CPU Usage</span>
                <span className="text-sm font-semibold text-slate-900">{resourceUsage.cpu}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUsageColor(resourceUsage.cpu)}`}
                  style={{ width: `${resourceUsage.cpu}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Memory Usage</span>
                <span className="text-sm font-semibold text-slate-900">{resourceUsage.memory}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUsageColor(resourceUsage.memory)}`}
                  style={{ width: `${resourceUsage.memory}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Storage Usage</span>
                <span className="text-sm font-semibold text-slate-900">{resourceUsage.storage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUsageColor(resourceUsage.storage)}`}
                  style={{ width: `${resourceUsage.storage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

