"use client";

import { useState, useMemo } from "react";
import { activities } from "@/lib/data/activities";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

type TimeScale = "day" | "week" | "month" | "year";

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: string;
  user: string;
  description: string;
  ipAddress?: string;
  poolId?: string;
  details?: Record<string, unknown>;
}

export function AllocationTimeline() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { showToast } = useToast();
  const [timeScale, setTimeScale] = useState<TimeScale>("week");
  const [filters, setFilters] = useState({
    userId: "all",
    poolId: "all",
    ipAddress: "",
    eventType: "all",
  });

  const timelineEvents = useMemo(() => {
    let filtered = activities.filter((activity) => {
      if (filters.userId !== "all" && activity.user !== filters.userId) return false;
      if (filters.poolId !== "all" && activity.pool_id !== filters.poolId) return false;
      if (filters.ipAddress && activity.ip_address && !activity.ip_address.includes(filters.ipAddress)) return false;
      if (filters.eventType !== "all" && activity.type !== filters.eventType) return false;
      return true;
    });

    filtered = filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return filtered.map((activity) => ({
      id: activity.id,
      timestamp: new Date(activity.timestamp),
      type: activity.type,
      user: activity.user,
      description: activity.description,
      ipAddress: activity.ip_address,
      poolId: activity.pool_id,
      details: activity.details,
    }));
  }, [filters]);

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      ip_allocation: "bg-green-500",
      ip_release: "bg-red-500",
      pool_creation: "bg-blue-500",
      pool_deletion: "bg-red-600",
      user_login: "bg-purple-500",
      system_alert: "bg-yellow-500",
    };
    return colors[type] || "bg-slate-500";
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      ip_allocation: "➕",
      ip_release: "🗑️",
      pool_creation: "📦",
      pool_deletion: "❌",
      user_login: "👤",
      system_alert: "⚠️",
    };
    return icons[type] || "•";
  };

  const formatDate = (date: Date, scale: TimeScale) => {
    switch (scale) {
      case "day":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      case "week":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      case "month":
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      case "year":
        return date.toLocaleDateString("en-US", { year: "numeric" });
      default:
        return date.toLocaleDateString();
    }
  };

  const groupEventsByTime = (events: TimelineEvent[], scale: TimeScale) => {
    const groups: Record<string, TimelineEvent[]> = {};
    
    events.forEach((event) => {
      let key = "";
      switch (scale) {
        case "day":
          key = event.timestamp.toLocaleDateString();
          break;
        case "week":
          const weekStart = new Date(event.timestamp);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          key = weekStart.toLocaleDateString();
          break;
        case "month":
          key = `${event.timestamp.getFullYear()}-${String(event.timestamp.getMonth() + 1).padStart(2, "0")}`;
          break;
        case "year":
          key = String(event.timestamp.getFullYear());
          break;
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });
    
    return groups;
  };

  const groupedEvents = useMemo(() => groupEventsByTime(timelineEvents, timeScale), [timelineEvents, timeScale]);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Allocation Timeline</h3>
          <p className="text-sm text-slate-600">Visual timeline of IP allocations and changes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time Scale</label>
            <select
              value={timeScale}
              onChange={(e) => setTimeScale(e.target.value as TimeScale)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">User</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Users</option>
              {Array.from(new Set(activities.map((a) => a.user))).map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pool</label>
            <select
              value={filters.poolId}
              onChange={(e) => setFilters({ ...filters, poolId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Pools</option>
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.cidr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">IP Address</label>
            <input
              type="text"
              value={filters.ipAddress}
              onChange={(e) => setFilters({ ...filters, ipAddress: e.target.value })}
              placeholder="Filter by IP..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Event Type</label>
          <select
            value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Events</option>
            <option value="ip_allocation">IP Allocation</option>
            <option value="ip_release">IP Release</option>
            <option value="pool_creation">Pool Creation</option>
            <option value="pool_deletion">Pool Deletion</option>
            <option value="user_login">User Login</option>
            <option value="system_alert">System Alert</option>
          </select>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedEvents)
            .sort(([a], [b]) => {
              if (timeScale === "year") return b.localeCompare(a);
              if (timeScale === "month") return b.localeCompare(a);
              return new Date(a).getTime() - new Date(b).getTime();
            })
            .map(([timeKey, events]) => (
              <div key={timeKey} className="relative">
                <div className="flex items-center mb-4">
                  <div className="flex-1 border-t border-slate-300"></div>
                  <div className="px-4">
                    <span className="text-sm font-semibold text-slate-700 bg-white">
                      {timeScale === "month" || timeScale === "year"
                        ? timeKey
                        : new Date(timeKey).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: timeScale === "week" ? "numeric" : undefined,
                          })}
                    </span>
                  </div>
                  <div className="flex-1 border-t border-slate-300"></div>
                </div>

                <div className="space-y-3 ml-8">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title={event.timestamp.toLocaleString()}
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${getEventColor(event.type)} text-white flex items-center justify-center text-sm shrink-0`}
                      >
                        {getEventIcon(event.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-900">{event.description}</span>
                          <span className="text-xs text-slate-500">
                            {formatDate(event.timestamp, timeScale)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span>By: {event.user}</span>
                          {event.ipAddress && (
                            <span className="font-mono">IP: {event.ipAddress}</span>
                          )}
                          {event.poolId && (
                            <span>Pool: {pools.find((p) => p.id === event.poolId)?.cidr || event.poolId}</span>
                          )}
                        </div>
                        {event.details && Object.keys(event.details).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-slate-100 rounded text-xs overflow-x-auto">
                              {JSON.stringify(event.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {timelineEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No events found matching the filters</p>
          </div>
        )}
      </div>
    </Card>
  );
}

