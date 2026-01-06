"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface Alert {
  id: string;
  name: string;
  type: "threshold" | "anomaly" | "capacity" | "compliance";
  condition: string;
  threshold?: number;
  enabled: boolean;
  recipients: string[];
  lastTriggered: string | null;
}

export function AlertConfiguration() {
  const { showToast } = useToast();
  const baseTime = 1700000000000;
  const [alerts, setAlerts] = useState<Alert[]>(() => [
    {
      id: "alert-001",
      name: "High Pool Utilization",
      type: "threshold",
      condition: "utilization > 90%",
      threshold: 90,
      enabled: true,
      recipients: ["admin@example.com"],
      lastTriggered: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "alert-002",
      name: "Pool Exhaustion Warning",
      type: "capacity",
      condition: "available_ips < 10%",
      threshold: 10,
      enabled: true,
      recipients: ["admin@example.com", "ops@example.com"],
      lastTriggered: null,
    },
    {
      id: "alert-003",
      name: "Unusual Allocation Rate",
      type: "anomaly",
      condition: "allocation_rate > 3σ",
      enabled: true,
      recipients: ["security@example.com"],
      lastTriggered: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    name: "",
    type: "threshold",
    condition: "",
    threshold: 80,
    enabled: true,
    recipients: [],
  });

  const handleCreateAlert = () => {
    if (!newAlert.name || !newAlert.condition) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const alert: Alert = {
      id: `alert-${Date.now()}`,
      name: newAlert.name,
      type: newAlert.type as Alert["type"],
      condition: newAlert.condition,
      threshold: newAlert.threshold,
      enabled: newAlert.enabled ?? true,
      recipients: newAlert.recipients || [],
      lastTriggered: null,
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      name: "",
      type: "threshold",
      condition: "",
      threshold: 80,
      enabled: true,
      recipients: [],
    });
    setIsCreating(false);
    showToast("Alert created successfully", "success");
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
    showToast("Alert updated", "success");
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    showToast("Alert deleted", "success");
  };

  const addRecipient = (email: string) => {
    if (!email.trim()) return;
    setNewAlert({
      ...newAlert,
      recipients: [...(newAlert.recipients || []), email.trim()],
    });
  };

  const removeRecipient = (index: number) => {
    setNewAlert({
      ...newAlert,
      recipients: newAlert.recipients?.filter((_, i) => i !== index) || [],
    });
  };

  const alertTypes = [
    { value: "threshold", label: "Threshold Alert", description: "Trigger when a metric crosses a threshold" },
    { value: "anomaly", label: "Anomaly Detection", description: "Trigger when unusual patterns are detected" },
    { value: "capacity", label: "Capacity Alert", description: "Trigger when capacity limits are approached" },
    { value: "compliance", label: "Compliance Alert", description: "Trigger when compliance violations occur" },
  ];

  const getAlertTypeBadge = (type: string) => {
    const typeColors: Record<string, { bg: string; text: string }> = {
      threshold: { bg: "bg-blue-100", text: "text-blue-800" },
      anomaly: { bg: "bg-yellow-100", text: "text-yellow-800" },
      capacity: { bg: "bg-red-100", text: "text-red-800" },
      compliance: { bg: "bg-purple-100", text: "text-purple-800" },
    };
    const config = typeColors[type] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {alertTypes.find((t) => t.value === type)?.label || type}
      </span>
    );
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Alert Configuration</h3>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            {isCreating ? "Cancel" : "+ New Alert"}
          </button>
        </div>

        {isCreating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <h4 className="text-md font-semibold text-slate-900">Create New Alert</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Alert Name *</label>
                <input
                  type="text"
                  value={newAlert.name || ""}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  placeholder="e.g., High Pool Utilization"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Alert Type *</label>
                <select
                  value={newAlert.type || "threshold"}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as Alert["type"] })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {alertTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Condition *</label>
                <input
                  type="text"
                  value={newAlert.condition || ""}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  placeholder="e.g., utilization > 90%"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              {(newAlert.type === "threshold" || newAlert.type === "capacity") && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Threshold (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAlert.threshold || 80}
                    onChange={(e) => setNewAlert({ ...newAlert, threshold: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Recipients</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRecipient(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input) {
                      addRecipient(input.value);
                      input.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newAlert.recipients?.map((recipient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {recipient}
                    <button
                      onClick={() => removeRecipient(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlert}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Create Alert
              </button>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Configured Alerts</h4>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="text-sm font-semibold text-slate-900">{alert.name}</h5>
                      {getAlertTypeBadge(alert.type)}
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          alert.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {alert.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Condition:</span>
                        <span className="ml-2 font-mono text-slate-900">{alert.condition}</span>
                        {alert.threshold && (
                          <span className="ml-2 text-slate-600">(Threshold: {alert.threshold}%)</span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Recipients:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.recipients.map((recipient, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                            >
                              {recipient}
                            </span>
                          ))}
                        </div>
                      </div>
                      {alert.lastTriggered && (
                        <div className="text-xs text-slate-500">
                          Last triggered: {new Date(alert.lastTriggered).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        alert.enabled
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {alert.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>  
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No alerts configured yet</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

