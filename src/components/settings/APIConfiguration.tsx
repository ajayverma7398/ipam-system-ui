"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface APIConfig {
  enabled: boolean;
  version: string;
  baseUrl: string;
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    allowCredentials: boolean;
  };
  apiDocumentation: {
    enabled: boolean;
    url: string;
  };
}

export function APIConfiguration() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<APIConfig>({
    enabled: true,
    version: "v1",
    baseUrl: "https://api.ipam.example.com",
    cors: {
      enabled: true,
      allowedOrigins: ["https://ipam.example.com", "https://admin.ipam.example.com"],
      allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
      allowCredentials: true,
    },
    apiDocumentation: {
      enabled: true,
      url: "https://api.ipam.example.com/docs",
    },
  });

  const [newOrigin, setNewOrigin] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [newHeader, setNewHeader] = useState("");

  const handleSave = () => {
    showToast("API configuration saved successfully", "success");
  };

  const handleAddOrigin = () => {
    if (!newOrigin || config.cors.allowedOrigins.includes(newOrigin)) {
      showToast("Invalid or duplicate origin", "error");
      return;
    }
    setConfig({
      ...config,
      cors: {
        ...config.cors,
        allowedOrigins: [...config.cors.allowedOrigins, newOrigin],
      },
    });
    setNewOrigin("");
    showToast("Origin added", "success");
  };

  const handleRemoveOrigin = (origin: string) => {
    setConfig({
      ...config,
      cors: {
        ...config.cors,
        allowedOrigins: config.cors.allowedOrigins.filter((o) => o !== origin),
      },
    });
    showToast("Origin removed", "success");
  };

  const handleAddMethod = () => {
    if (!newMethod || config.cors.allowedMethods.includes(newMethod)) {
      showToast("Invalid or duplicate method", "error");
      return;
    }
    setConfig({
      ...config,
      cors: {
        ...config.cors,
        allowedMethods: [...config.cors.allowedMethods, newMethod],
      },
    });
    setNewMethod("");
    showToast("Method added", "success");
  };

  const handleRemoveMethod = (method: string) => {
    setConfig({
      ...config,
      cors: {
        ...config.cors,
        allowedMethods: config.cors.allowedMethods.filter((m) => m !== method),
      },
    });
    showToast("Method removed", "success");
  };

  const handleAddHeader = () => {
    if (!newHeader || config.cors.allowedHeaders.includes(newHeader)) {
      showToast("Invalid or duplicate header", "error");
      return;
    }
    setConfig({
      ...config,
      cors: {
        ...config.cors,
        allowedHeaders: [...config.cors.allowedHeaders, newHeader],
      },
    });
    setNewHeader("");
    showToast("Header added", "success");
  };

  const handleRemoveHeader = (header: string) => {
    setConfig({
      ...config,
      cors: {
        ...config.cors,
        allowedHeaders: config.cors.allowedHeaders.filter((h) => h !== header),
      },
    });
    showToast("Header removed", "success");
  };

  const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];
  const commonHeaders = [
    "Content-Type",
    "Authorization",
    "X-API-Key",
    "Accept",
    "X-Requested-With",
    "X-CSRF-Token",
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
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
              <p className="text-sm font-medium text-slate-900">Enable API</p>
              <p className="text-xs text-slate-600">Allow external access via REST API</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">API Version</label>
                <select
                  value={config.version}
                  onChange={(e) => setConfig({ ...config, version: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="v1">v1 (Current)</option>
                  <option value="v2">v2 (Beta)</option>
                  <option value="v3">v3 (Alpha)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Base URL</label>
                <input
                  type="url"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  placeholder="https://api.ipam.example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">API Documentation</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={config.apiDocumentation.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        apiDocumentation: { ...config.apiDocumentation, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable API Documentation</p>
                    <p className="text-xs text-slate-600">Make API documentation publicly accessible</p>
                  </div>
                </label>
                {config.apiDocumentation.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Documentation URL</label>
                    <input
                      type="url"
                      value={config.apiDocumentation.url}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          apiDocumentation: { ...config.apiDocumentation, url: e.target.value },
                        })
                      }
                      placeholder="https://api.ipam.example.com/docs"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">CORS Settings</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cors.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cors: { ...config.cors, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable CORS</p>
                    <p className="text-xs text-slate-600">Allow cross-origin requests</p>
                  </div>
                </label>

                {config.cors.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Allowed Origins
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newOrigin}
                          onChange={(e) => setNewOrigin(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddOrigin()}
                          placeholder="https://example.com"
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                        <button
                          onClick={handleAddOrigin}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {config.cors.allowedOrigins.map((origin) => (
                          <span
                            key={origin}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-mono"
                          >
                            {origin}
                            <button
                              onClick={() => handleRemoveOrigin(origin)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Allowed HTTP Methods
                      </label>
                      <div className="flex gap-2 mb-2">
                        <select
                          value={newMethod}
                          onChange={(e) => setNewMethod(e.target.value)}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select method...</option>
                          {httpMethods
                            .filter((m) => !config.cors.allowedMethods.includes(m))
                            .map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={handleAddMethod}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {config.cors.allowedMethods.map((method) => (
                          <span
                            key={method}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                          >
                            {method}
                            <button
                              onClick={() => handleRemoveMethod(method)}
                              className="text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Allowed Headers
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newHeader}
                          onChange={(e) => setNewHeader(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddHeader()}
                          placeholder="X-Custom-Header"
                          list="common-headers"
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                        <datalist id="common-headers">
                          {commonHeaders
                            .filter((h) => !config.cors.allowedHeaders.includes(h))
                            .map((header) => (
                              <option key={header} value={header} />
                            ))}
                        </datalist>
                        <button
                          onClick={handleAddHeader}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {config.cors.allowedHeaders.map((header) => (
                          <span
                            key={header}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-mono"
                          >
                            {header}
                            <button
                              onClick={() => handleRemoveHeader(header)}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.cors.allowCredentials}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              cors: { ...config.cors, allowCredentials: e.target.checked },
                            })
                          }
                          className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Allow Credentials</p>
                          <p className="text-xs text-slate-600">
                            Include cookies and authentication headers in CORS requests
                          </p>
                        </div>
                      </label>
                    </div>
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

