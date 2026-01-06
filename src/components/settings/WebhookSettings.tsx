"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number; 
    backoff: "linear" | "exponential";
  };
  payloadTemplate: string;
  lastTriggered: string | null;
  successCount: number;
  failureCount: number;
}

export function WebhookSettings() {
  const { showToast } = useToast();
  const baseTime = 1700000000000;
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "webhook-001",
      name: "IP Allocation Webhook",
      url: "https://example.com/api/webhooks/ip-allocation",
      events: ["ip.allocated", "ip.released"],
      secret: "whsec_xxxxxxxxxxxx",
      enabled: true,
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 5,
        backoff: "exponential",
      },
      payloadTemplate: "default",
      lastTriggered: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
      successCount: 1245,
      failureCount: 12,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newWebhook, setNewWebhook] = useState<Partial<Webhook>>({
    name: "",
    url: "",
    events: [],
    secret: "",
    enabled: true,
    retryPolicy: {
      maxRetries: 3,
      retryDelay: 5,
      backoff: "exponential",
    },
    payloadTemplate: "default",
  });

  const availableEvents = [
    { id: "ip.allocated", label: "IP Allocated", description: "When an IP address is allocated" },
    { id: "ip.released", label: "IP Released", description: "When an IP address is released" },
    { id: "pool.created", label: "Pool Created", description: "When a new IP pool is created" },
    { id: "pool.updated", label: "Pool Updated", description: "When an IP pool is updated" },
    { id: "pool.deleted", label: "Pool Deleted", description: "When an IP pool is deleted" },
    { id: "user.created", label: "User Created", description: "When a new user is created" },
    { id: "alert.triggered", label: "Alert Triggered", description: "When a system alert is triggered" },
  ];

  const generateSecret = (): string => {
    return `whsec_${Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("")}`;
  };

  const handleCreateWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || (newWebhook.events?.length ?? 0) === 0) {
      showToast("Please provide name, URL, and at least one event", "error");
      return;
    }
    const webhook: Webhook = {
      id: `webhook-${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events || [],
      secret: newWebhook.secret || generateSecret(),
      enabled: newWebhook.enabled ?? true,
      retryPolicy: newWebhook.retryPolicy || {
        maxRetries: 3,
        retryDelay: 5,
        backoff: "exponential",
      },
      payloadTemplate: newWebhook.payloadTemplate || "default",
      lastTriggered: null,
      successCount: 0,
      failureCount: 0,
    };
    setWebhooks([...webhooks, webhook]);
    setNewWebhook({
      name: "",
      url: "",
      events: [],
      secret: "",
      enabled: true,
      retryPolicy: { maxRetries: 3, retryDelay: 5, backoff: "exponential" },
      payloadTemplate: "default",
    });
    setIsCreating(false);
    showToast("Webhook created successfully", "success");
  };

  const toggleEvent = (eventId: string) => {
    const events = newWebhook.events || [];
    if (events.includes(eventId)) {
      setNewWebhook({ ...newWebhook, events: events.filter((e) => e !== eventId) });
    } else {
      setNewWebhook({ ...newWebhook, events: [...events, eventId] });
    }
  };

  const handleDeleteWebhook = (webhookId: string) => {
    if (confirm("Are you sure you want to delete this webhook?")) {
      setWebhooks(webhooks.filter((w) => w.id !== webhookId));
      showToast("Webhook deleted", "success");
    }
  };

  const handleTestWebhook = async () => {
    showToast("Testing webhook...", "info");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    showToast("Webhook test successful", "success");
  };

  const payloadTemplates = [
    { id: "default", label: "Default Template", description: "Standard payload format" },
    { id: "custom", label: "Custom Template", description: "Custom JSON template" },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Webhook Settings</h3>
            <p className="text-sm text-slate-600">Configure webhook endpoints for event notifications</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            {isCreating ? "Cancel" : "+ New Webhook"}
          </button>
        </div>

        {isCreating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <h4 className="text-md font-semibold text-slate-900">Create New Webhook</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Webhook Name *</label>
                <input
                  type="text"
                  value={newWebhook.name || ""}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="e.g., IP Allocation Webhook"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL *</label>
                <input
                  type="url"
                  value={newWebhook.url || ""}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://example.com/api/webhooks"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Webhook Secret</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWebhook.secret || ""}
                    onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
                    placeholder="Auto-generated if left empty"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    onClick={() => setNewWebhook({ ...newWebhook, secret: generateSecret() })}
                    className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Event Subscriptions *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableEvents.map((event) => (
                  <label
                    key={event.id}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={newWebhook.events?.includes(event.id) || false}
                      onChange={() => toggleEvent(event.id)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900">{event.label}</span>
                      <p className="text-xs text-slate-600">{event.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-900 mb-3">Retry Policy</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Retries</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newWebhook.retryPolicy?.maxRetries || 3}
                    onChange={(e) =>
                      setNewWebhook({
                        ...newWebhook,
                        retryPolicy: {
                          ...(newWebhook.retryPolicy || { maxRetries: 3, retryDelay: 5, backoff: "exponential" }),
                          maxRetries: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Retry Delay (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    value={newWebhook.retryPolicy?.retryDelay || 5}
                    onChange={(e) =>
                      setNewWebhook({
                        ...newWebhook,
                        retryPolicy: {
                          ...(newWebhook.retryPolicy || { maxRetries: 3, retryDelay: 5, backoff: "exponential" }),
                          retryDelay: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Backoff Strategy</label>
                  <select
                    value={newWebhook.retryPolicy?.backoff || "exponential"}
                    onChange={(e) =>
                      setNewWebhook({
                        ...newWebhook,
                        retryPolicy: {
                          ...(newWebhook.retryPolicy || { maxRetries: 3, retryDelay: 5, backoff: "exponential" }),
                          backoff: e.target.value as "linear" | "exponential",
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="linear">Linear</option>
                    <option value="exponential">Exponential</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payload Template</label>
              <select
                value={newWebhook.payloadTemplate || "default"}
                onChange={(e) => setNewWebhook({ ...newWebhook, payloadTemplate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {payloadTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWebhook}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Create Webhook
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="text-sm font-semibold text-slate-900">{webhook.name}</h5>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        webhook.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {webhook.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="text-sm font-mono text-slate-600 mb-3">{webhook.url}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-600 mb-3">
                    <div>
                      <span className="font-medium">Retry Policy:</span> {webhook.retryPolicy.maxRetries} retries,{" "}
                      {webhook.retryPolicy.retryDelay}s delay ({webhook.retryPolicy.backoff})
                    </div>
                    <div>
                      <span className="font-medium">Last Triggered:</span>{" "}
                      {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleString() : "Never"}
                    </div>
                    <div>
                      <span className="font-medium">Success:</span> {webhook.successCount}
                    </div>
                    <div>
                      <span className="font-medium">Failures:</span> {webhook.failureCount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={handleTestWebhook}
                    className="px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

