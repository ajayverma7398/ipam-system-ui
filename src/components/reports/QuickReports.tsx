"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { LoadingSpinner } from "@/components/common/feedback";

interface QuickReport {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isFavorite?: boolean;
}

export function QuickReports() {
  const { showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const quickReports: QuickReport[] = [
    {
      id: "daily-utilization",
      name: "Daily Utilization Summary",
      description: "Today's pool utilization overview",
      icon: "📊",
      category: "utilization",
      isFavorite: true,
    },
    {
      id: "top-allocated",
      name: "Top Allocated Pools",
      description: "Pools with highest allocation rates",
      icon: "📈",
      category: "allocation",
      isFavorite: true,
    },
    {
      id: "expiring-ips",
      name: "Expiring IPs Report",
      description: "IPs expiring in the next 7 days",
      icon: "⏰",
      category: "allocation",
    },
    {
      id: "capacity-forecast",
      name: "Capacity Forecast",
      description: "30-day utilization forecast",
      icon: "🔮",
      category: "capacity",
    },
    {
      id: "audit-summary",
      name: "Audit Summary",
      description: "Weekly audit activity summary",
      icon: "📋",
      category: "audit",
    },
    {
      id: "free-ips",
      name: "Available IPs Report",
      description: "Pools with available IP addresses",
      icon: "✅",
      category: "utilization",
    },
  ];

  const recentReports: QuickReport[] = [
    {
      id: "weekly-utilization",
      name: "Weekly Utilization Report",
      description: "Generated 2 hours ago",
      icon: "📊",
      category: "utilization",
    },
    {
      id: "allocation-trends",
      name: "Allocation Trends",
      description: "Generated yesterday",
      icon: "📈",
      category: "allocation",
    },
  ];

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast("Report generated successfully", "success");
    } catch {
      showToast("Failed to generate report", "error");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Reports</h3>
            <p className="text-sm text-slate-600">One-click common reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickReports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{report.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{report.name}</h4>
                      <p className="text-xs text-slate-600">{report.description}</p>
                    </div>
                  </div>
                  {report.isFavorite && (
                    <span className="text-yellow-500" title="Favorite">
                      ⭐
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating === report.id}
                  className="w-full mt-3 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isGenerating === report.id ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Recent Reports</h3>
            <p className="text-sm text-slate-600">Quick access to recently generated reports</p>
          </div>

          <div className="space-y-2">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{report.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{report.name}</h4>
                    <p className="text-xs text-slate-500">{report.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

