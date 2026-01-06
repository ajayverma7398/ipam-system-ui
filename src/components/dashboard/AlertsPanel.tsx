"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/data-display";


interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
  pool_id?: string;
  ip_address?: string;
  severity?: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  maxItems?: number;
}

type SeverityGroup = "error" | "warning" | "info";

export function AlertsPanel({ alerts, maxItems = 10 }: AlertsPanelProps) {
  const router = useRouter();
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const groupedAlerts = useMemo(() => {
    const filtered = alerts.filter((alert) => !dismissedAlerts.has(alert.id));
    const groups: Record<SeverityGroup, Alert[]> = {
      error: [],
      warning: [],
      info: [],
    };

    filtered.forEach((alert) => {
      if (groups[alert.type]) {
        groups[alert.type].push(alert);
      }
    });

    return groups;
  }, [alerts, dismissedAlerts]);

  const unreadCount = useMemo(() => {
    return alerts.filter((alert) => !acknowledgedAlerts.has(alert.id) && !dismissedAlerts.has(alert.id)).length;
  }, [alerts, acknowledgedAlerts, dismissedAlerts]);

  const toggleExpand = (alertId: string) => {
    setExpandedAlerts((prev) => {
      const next = new Set(prev);
      if (next.has(alertId)) {
        next.delete(alertId);
      } else {
        next.add(alertId);
      }
      return next;
    });
  };

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts((prev) => new Set(prev).add(alertId));
  };

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const mapAlertTypeToStatus = (alertType: "warning" | "error" | "info"): "allocated" | "pending" | "system" => {
    switch (alertType) {
      case "error":
        return "allocated";
      case "warning":
        return "pending";
      case "info":
        return "system";
    }
  };

  const renderAlertGroup = (severity: SeverityGroup, groupAlerts: Alert[]) => {
    if (groupAlerts.length === 0) return null;

    const displayAlerts = groupAlerts.slice(0, maxItems);

    return (
      <div key={severity} className="mb-4 last:mb-0">
        <h4 className="text-sm font-semibold text-slate-700 mb-2 capitalize">{severity} Alerts</h4>
        <div className="space-y-2">
          {displayAlerts.map((alert) => {
            const isExpanded = expandedAlerts.has(alert.id);
            const isAcknowledged = acknowledgedAlerts.has(alert.id);

            return (
              <div
                key={alert.id}
                className={`p-3 bg-slate-50 rounded-lg border-l-4 ${
                  alert.type === "error"
                    ? "border-red-500"
                    : alert.type === "warning"
                    ? "border-yellow-500"
                    : "border-blue-500"
                } ${isAcknowledged ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={mapAlertTypeToStatus(alert.type)} type="pool" />
                      <span className="text-xs text-slate-500">{formatTimestamp(alert.timestamp)}</span>
                      {!isAcknowledged && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">New</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-900">{alert.message}</p>
                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        {alert.pool_id && <p className="text-xs text-slate-600">Pool: {alert.pool_id}</p>}
                        {alert.ip_address && <p className="text-xs text-slate-600">IP: {alert.ip_address}</p>}
                        {alert.severity && <p className="text-xs text-slate-600">Severity: {alert.severity}</p>}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => toggleExpand(alert.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {isExpanded ? "Show Less" : "Show Details"}
                      </button>
                      {!isAcknowledged && (
                        <>
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="text-xs text-green-600 hover:text-green-700 font-medium"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => handleDismiss(alert.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900">System Alerts</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={() => router.push("/dashboard/alerts")}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No alerts</p>
        ) : (
          <>
            {renderAlertGroup("error", groupedAlerts.error)}
            {renderAlertGroup("warning", groupedAlerts.warning)}
            {renderAlertGroup("info", groupedAlerts.info)}
          </>
        )}
      </div>
    </Card>
  );
}
