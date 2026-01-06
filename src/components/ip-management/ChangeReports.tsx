"use client";

import { useState, useMemo } from "react";
import { activities } from "@/lib/data/activities";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";

type ReportPeriod = "daily" | "weekly" | "monthly";

export function ChangeReports() {
  const [period, setPeriod] = useState<ReportPeriod>("weekly");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const reportData = useMemo(() => {
    const selectedDateObj = new Date(selectedDate);
    let startDate: Date;
    let endDate: Date = new Date(selectedDateObj);

    switch (period) {
      case "daily":
        startDate = new Date(selectedDateObj);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "weekly":
        startDate = new Date(selectedDateObj);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "monthly":
        startDate = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
        endDate = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    const periodActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= startDate && activityDate <= endDate;
    });

    const userCounts: Record<string, number> = {};
    periodActivities.forEach((activity) => {
      userCounts[activity.user] = (userCounts[activity.user] || 0) + 1;
    });
    const mostActiveUsers = Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([user, count]) => ({ user, count }));

    const poolCounts: Record<string, number> = {};
    periodActivities.forEach((activity) => {
      if (activity.pool_id) {
        poolCounts[activity.pool_id] = (poolCounts[activity.pool_id] || 0) + 1;
      }
    });
    const mostActivePools = Object.entries(poolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([poolId, count]) => ({
        poolId,
        poolCidr: pools.find((p) => p.id === poolId)?.cidr || poolId,
        count,
      }));

    const eventTypeCounts: Record<string, number> = {};
    periodActivities.forEach((activity) => {
      eventTypeCounts[activity.type] = (eventTypeCounts[activity.type] || 0) + 1;
    });

    const hourlyAllocations: Record<number, number> = {};
    periodActivities
      .filter((a) => a.type === "ip_allocation")
      .forEach((activity) => {
        const hour = new Date(activity.timestamp).getHours();
        hourlyAllocations[hour] = (hourlyAllocations[hour] || 0) + 1;
      });

    const peakHour = Object.entries(hourlyAllocations)
      .sort(([, a], [, b]) => b - a)[0];

    const avgDailyActivity = periodActivities.length / (period === "daily" ? 1 : period === "weekly" ? 7 : 30);
    const anomalies: string[] = [];
    
    if (periodActivities.length > avgDailyActivity * 2) {
      anomalies.push("Unusually high activity detected");
    }
    
    const errorCount = periodActivities.filter((a) => a.severity === "error").length;
    if (errorCount > periodActivities.length * 0.1) {
      anomalies.push("High error rate detected");
    }

    return {
      period,
      startDate,
      endDate,
      totalEvents: periodActivities.length,
      mostActiveUsers,
      mostActivePools,
      eventTypeCounts,
      peakHour: peakHour ? { hour: parseInt(peakHour[0]), count: peakHour[1] } : null,
      anomalies,
    };
  }, [period, selectedDate]);

  const formatDateRange = () => {
    if (period === "daily") {
      return new Date(reportData.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    if (period === "weekly") {
      return `${new Date(reportData.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${new Date(reportData.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return new Date(reportData.startDate).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Change Reports</h3>
          <p className="text-sm text-slate-600">Daily/weekly/monthly change summaries and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Events</p>
            <p className="text-2xl font-bold text-blue-900">{reportData.totalEvents}</p>
            <p className="text-xs text-blue-600 mt-1">{formatDateRange()}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Allocations</p>
            <p className="text-2xl font-bold text-green-900">
              {reportData.eventTypeCounts.ip_allocation || 0}
            </p>
            <p className="text-xs text-green-600 mt-1">IP allocations</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Releases</p>
            <p className="text-2xl font-bold text-purple-900">
              {reportData.eventTypeCounts.ip_release || 0}
            </p>
            <p className="text-xs text-purple-600 mt-1">IP releases</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Most Active Users</h4>
          <div className="space-y-2">
            {reportData.mostActiveUsers.map(({ user, count }, index) => (
              <div key={user} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{user}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{count} events</span>
              </div>
            ))}
            {reportData.mostActiveUsers.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No activity in this period</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Most Active Pools</h4>
          <div className="space-y-2">
            {reportData.mostActivePools.map(({ poolId, poolCidr, count }, index) => (
              <div key={poolId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-mono font-medium text-slate-900">{poolCidr}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{count} events</span>
              </div>
            ))}
            {reportData.mostActivePools.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No pool activity in this period</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Event Type Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(reportData.eventTypeCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-900 capitalize">{type.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(count / reportData.totalEvents) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {reportData.peakHour && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-900 mb-1">Peak Allocation Hour</p>
            <p className="text-lg font-semibold text-yellow-900">
              {reportData.peakHour.hour}:00 - {reportData.peakHour.hour + 1}:00
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              {reportData.peakHour.count} allocations during this hour
            </p>
          </div>
        )}

        {reportData.anomalies.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900 mb-2">⚠️ Anomalies Detected</p>
            <ul className="space-y-1">
              {reportData.anomalies.map((anomaly, index) => (
                <li key={index} className="text-xs text-red-700">• {anomaly}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

