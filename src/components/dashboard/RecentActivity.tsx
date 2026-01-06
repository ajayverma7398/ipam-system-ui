"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";

interface RecentActivityItem {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  user: string;
  ip_address?: string;
  pool_id?: string;
}

interface RecentActivityProps {
  activities: RecentActivityItem[];
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function RecentActivity({
  activities,
  maxItems = 10,
  autoRefresh = true,
  refreshInterval = 30000,
}: RecentActivityProps) {
  const router = useRouter();
  const [displayActivities, setDisplayActivities] = useState(activities.slice(0, maxItems));
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLastRefresh(new Date());
    }, 0);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setDisplayActivities(activities.slice(0, maxItems));
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [activities, maxItems, autoRefresh, refreshInterval]);

  const getActivityColor = (type: string) => {
    switch (type) {
      case "allocation":
      case "ip_allocation":
        return "bg-green-500";
      case "release":
      case "ip_release":
        return "bg-red-500";
      case "pool_creation":
      case "pool_created":
        return "bg-blue-500";
      case "pool_deletion":
      case "pool_deleted":
        return "bg-orange-500";
      case "user_login":
        return "bg-purple-500";
      case "system_alert":
        return "bg-yellow-500";
      default:
        return "bg-slate-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "allocation":
      case "ip_allocation":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case "release":
      case "ip_release":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "pool_creation":
      case "pool_created":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleActivityClick = (activity: RecentActivityItem) => {
    if (activity.pool_id) {
      router.push(`/dashboard/pools/${activity.pool_id}`);
    } else if (activity.ip_address) {
      router.push(`/dashboard/pools?search=${activity.ip_address}`);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
          {autoRefresh && (
            <p className="text-xs text-slate-500 mt-1" suppressHydrationWarning>
              Auto-refreshing • Last: {lastRefresh ? lastRefresh.toLocaleTimeString() : "—"}
            </p>
          )}
        </div>
        <button
          onClick={() => router.push("/dashboard/activities")}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayActivities.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No recent activities</p>
        ) : (
          displayActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group"
            >
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${getActivityColor(activity.type)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500">{formatTimestamp(activity.timestamp)}</p>
                  <span className="text-xs text-slate-400">•</span>
                  <p className="text-xs text-slate-500 truncate">{activity.user}</p>
                </div>
              </div>
              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {getActivityIcon(activity.type)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
