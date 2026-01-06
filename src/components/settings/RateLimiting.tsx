"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface RateLimitConfig {
  enabled: boolean;
  defaultLimit: {
    requests: number;
    window: number; 
  };
  perEndpointLimits: Array<{
    endpoint: string;
    requests: number;
    window: number;
  }>;
  ipWhitelist: string[];
  quotas: Array<{
    apiKey: string;
    dailyLimit: number;
    monthlyLimit: number;
  }>;
  securityHeaders: {
    enabled: boolean;
    strictTransportSecurity: boolean;
    contentSecurityPolicy: string;
    xFrameOptions: string;
    xContentTypeOptions: boolean;
  };
}

export function RateLimiting() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<RateLimitConfig>({
    enabled: true,
    defaultLimit: {
      requests: 1000,
      window: 3600, 
    },
    perEndpointLimits: [
      { endpoint: "/api/v1/pools", requests: 500, window: 3600 },
      { endpoint: "/api/v1/allocations", requests: 2000, window: 3600 },
    ],
    ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
    quotas: [
      { apiKey: "ipam_live_xxxxxxxxxxxx", dailyLimit: 10000, monthlyLimit: 300000 },
    ],
    securityHeaders: {
      enabled: true,
      strictTransportSecurity: true,
      contentSecurityPolicy: "default-src 'self'",
      xFrameOptions: "DENY",
      xContentTypeOptions: true,
    },
  });

  const [newIP, setNewIP] = useState("");
  const [newEndpoint, setNewEndpoint] = useState("");
  const [newEndpointLimit, setNewEndpointLimit] = useState({ requests: 100, window: 3600 });

  const handleSave = () => {
    showToast("Rate limiting settings saved successfully", "success");
  };

  const handleAddIP = () => {
    if (!newIP || config.ipWhitelist.includes(newIP)) {
      showToast("Invalid or duplicate IP address/CIDR", "error");
      return;
    }
    setConfig({
      ...config,
      ipWhitelist: [...config.ipWhitelist, newIP],
    });
    setNewIP("");
    showToast("IP address added to whitelist", "success");
  };

  const handleRemoveIP = (ip: string) => {
    setConfig({
      ...config,
      ipWhitelist: config.ipWhitelist.filter((i) => i !== ip),
    });
    showToast("IP address removed from whitelist", "success");
  };

  const handleAddEndpoint = () => {
    if (!newEndpoint || config.perEndpointLimits.some((e) => e.endpoint === newEndpoint)) {
      showToast("Invalid or duplicate endpoint", "error");
      return;
    }
    setConfig({
      ...config,
      perEndpointLimits: [
        ...config.perEndpointLimits,
        { endpoint: newEndpoint, ...newEndpointLimit },
      ],
    });
    setNewEndpoint("");
    setNewEndpointLimit({ requests: 100, window: 3600 });
    showToast("Endpoint limit added", "success");
  };

  const handleRemoveEndpoint = (endpoint: string) => {
    setConfig({
      ...config,
      perEndpointLimits: config.perEndpointLimits.filter((e) => e.endpoint !== endpoint),
    });
    showToast("Endpoint limit removed", "success");
  };

  const windowOptions = [
    { value: 60, label: "1 minute" },
    { value: 300, label: "5 minutes" },
    { value: 900, label: "15 minutes" },
    { value: 3600, label: "1 hour" },
    { value: 86400, label: "1 day" },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Rate Limiting & Security</h3>
            <p className="text-sm text-slate-600">Configure rate limits, IP whitelisting, and security headers</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Rate Limiting</p>
              <p className="text-xs text-slate-600">Limit API requests to prevent abuse</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Default Rate Limit</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Requests per Window
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.defaultLimit.requests}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          defaultLimit: { ...config.defaultLimit, requests: Number(e.target.value) },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Window</label>
                    <select
                      value={config.defaultLimit.window}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          defaultLimit: { ...config.defaultLimit, window: Number(e.target.value) },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {windowOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Per-Endpoint Rate Limits</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Endpoint</label>
                    <input
                      type="text"
                      value={newEndpoint}
                      onChange={(e) => setNewEndpoint(e.target.value)}
                      placeholder="/api/v1/endpoint"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Requests</label>
                    <input
                      type="number"
                      min="1"
                      value={newEndpointLimit.requests}
                      onChange={(e) =>
                        setNewEndpointLimit({ ...newEndpointLimit, requests: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddEndpoint}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Limit
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {config.perEndpointLimits.map((limit) => (
                    <div
                      key={limit.endpoint}
                      className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-mono text-slate-900">{limit.endpoint}</span>
                        <span className="text-sm text-slate-600 ml-4">
                          {limit.requests} requests per{" "}
                          {windowOptions.find((o) => o.value === limit.window)?.label || `${limit.window}s`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveEndpoint(limit.endpoint)}
                        className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">IP Whitelist</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-3">
                  IP addresses or CIDR ranges that bypass rate limiting
                </p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddIP()}
                    placeholder="192.168.1.0/24 or 10.0.0.1"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    onClick={handleAddIP}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add IP
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.ipWhitelist.map((ip) => (
                    <span
                      key={ip}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-mono"
                    >
                      {ip}
                      <button
                        onClick={() => handleRemoveIP(ip)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">API Usage Quotas</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-3">
                  Set daily and monthly request limits for specific API keys
                </p>
                <div className="space-y-3">
                  {config.quotas.map((quota, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-mono text-slate-900">{quota.apiKey}</span>
                        <div className="mt-1 text-xs text-slate-600">
                          Daily: {quota.dailyLimit.toLocaleString()} | Monthly:{" "}
                          {quota.monthlyLimit.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newQuotas = config.quotas.filter((_, i) => i !== index);
                          setConfig({ ...config, quotas: newQuotas });
                        }}
                        className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => showToast("Add quota feature - coming soon", "info")}
                  className="mt-3 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  + Add Quota
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Security Headers</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.securityHeaders.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        securityHeaders: { ...config.securityHeaders, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Security Headers</p>
                    <p className="text-xs text-slate-600">Add security headers to API responses</p>
                  </div>
                </label>

                {config.securityHeaders.enabled && (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.securityHeaders.strictTransportSecurity}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            securityHeaders: {
                              ...config.securityHeaders,
                              strictTransportSecurity: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Strict-Transport-Security (HSTS)</p>
                        <p className="text-xs text-slate-600">Force HTTPS connections</p>
                      </div>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Content-Security-Policy
                      </label>
                      <input
                        type="text"
                        value={config.securityHeaders.contentSecurityPolicy}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            securityHeaders: {
                              ...config.securityHeaders,
                              contentSecurityPolicy: e.target.value,
                            },
                          })
                        }
                        placeholder="default-src 'self'"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">X-Frame-Options</label>
                      <select
                        value={config.securityHeaders.xFrameOptions}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            securityHeaders: {
                              ...config.securityHeaders,
                              xFrameOptions: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DENY">DENY</option>
                        <option value="SAMEORIGIN">SAMEORIGIN</option>
                        <option value="ALLOW-FROM">ALLOW-FROM</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.securityHeaders.xContentTypeOptions}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            securityHeaders: {
                              ...config.securityHeaders,
                              xContentTypeOptions: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">X-Content-Type-Options: nosniff</p>
                        <p className="text-xs text-slate-600">Prevent MIME type sniffing</p>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

