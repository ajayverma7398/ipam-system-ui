"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";


interface APIKey {
  id: string;
  name: string;
  key: string; // Masked in display
  permissions: string[];
  scopes: string[];
  createdAt: string;
  expiresAt: string | null;
  lastUsed: string | null;
  usageCount: number;
  status: "active" | "expired" | "revoked";
}

export function APIKeys() {
  const { showToast } = useToast();
  const baseTime = 1700000000000;
  const [keys, setKeys] = useState<APIKey[]>([
    {
      id: "key-001",
      name: "Production API Key",
      key: "ipam_live_xxxxxxxxxxxx",
      permissions: ["read", "write"],
      scopes: ["pools", "allocations", "reports"],
      createdAt: new Date(baseTime - 90 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(baseTime + 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
      usageCount: 15234,
      status: "active",
    },
    {
      id: "key-002",
      name: "Read-only API Key",
      key: "ipam_read_xxxxxxxxxxxx",
      permissions: ["read"],
      scopes: ["pools", "reports"],
      createdAt: new Date(baseTime - 30 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: null,
      lastUsed: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
      usageCount: 892,
      status: "active",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState<Partial<APIKey>>({
    name: "",
    permissions: [],
    scopes: [],
    expiresAt: null,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const permissions = [
    { id: "read", label: "Read", description: "View data" },
    { id: "write", label: "Write", description: "Create and modify data" },
    { id: "delete", label: "Delete", description: "Delete data" },
    { id: "admin", label: "Admin", description: "Full administrative access" },
  ];

  const scopes = [
    { id: "pools", label: "Pools", description: "IP pool management" },
    { id: "allocations", label: "Allocations", description: "IP allocation management" },
    { id: "reports", label: "Reports", description: "Reports and analytics" },
    { id: "users", label: "Users", description: "User management" },
    { id: "settings", label: "Settings", description: "System settings" },
  ];

  const generateAPIKey = (): string => {
    const prefix = "ipam_";
    const random = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
    return `${prefix}${random}`;
  };

  const handleCreateKey = () => {
    if (!newKey.name || (newKey.permissions?.length ?? 0) === 0) {
      showToast("Please provide a name and at least one permission", "error");
      return;
    }
    const apiKey: APIKey = {
      id: `key-${Date.now()}`,
      name: newKey.name,
      key: generateAPIKey(),
      permissions: newKey.permissions || [],
      scopes: newKey.scopes || [],
      createdAt: new Date().toISOString(),
      expiresAt: newKey.expiresAt || null,
      lastUsed: null,
      usageCount: 0,
      status: "active",
    };
    setKeys([apiKey, ...keys]);
    setNewKey({ name: "", permissions: [], scopes: [], expiresAt: null });
    setIsCreating(false);
    showToast("API key created successfully", "success");
  };

  const handleRevokeKey = (keyId: string) => {
    if (confirm("Are you sure you want to revoke this API key?")) {
      setKeys(keys.map((k) => (k.id === keyId ? { ...k, status: "revoked" as const } : k)));
      showToast("API key revoked", "success");
    }
  };

  const handleCopyKey = (keyId: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    showToast("API key copied to clipboard", "success");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string): string => {
    const parts = key.split("_");
    if (parts.length >= 2) {
      return `${parts[0]}_${parts[1]}_${"•".repeat(12)}`;
    }
    return `${key.slice(0, 8)}${"•".repeat(12)}`;
  };

  const togglePermission = (permissionId: string) => {
    const permissions = newKey.permissions || [];
    if (permissions.includes(permissionId)) {
      setNewKey({ ...newKey, permissions: permissions.filter((p) => p !== permissionId) });
    } else {
      setNewKey({ ...newKey, permissions: [...permissions, permissionId] });
    }
  };

  const toggleScope = (scopeId: string) => {
    const scopes = newKey.scopes || [];
    if (scopes.includes(scopeId)) {
      setNewKey({ ...newKey, scopes: scopes.filter((s) => s !== scopeId) });
    } else {
      setNewKey({ ...newKey, scopes: [...scopes, scopeId] });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      active: { bg: "bg-green-100", text: "text-green-800" },
      expired: { bg: "bg-red-100", text: "text-red-800" },
      revoked: { bg: "bg-slate-100", text: "text-slate-800" },
    };
    const config = statusColors[status] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">API Key Management</h3>
            <p className="text-sm text-slate-600">Generate and manage API keys for external access</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            {isCreating ? "Cancel" : "+ Generate API Key"}
          </button>
        </div>

        {isCreating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <h4 className="text-md font-semibold text-slate-900">Create New API Key</h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Key Name *</label>
              <input
                type="text"
                value={newKey.name || ""}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                placeholder="e.g., Production API Key"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Permissions *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={newKey.permissions?.includes(perm.id) || false}
                      onChange={() => togglePermission(perm.id)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900">{perm.label}</span>
                      <p className="text-xs text-slate-600">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Scopes</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scopes.map((scope) => (
                  <label
                    key={scope.id}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={newKey.scopes?.includes(scope.id) || false}
                      onChange={() => toggleScope(scope.id)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900">{scope.label}</span>
                      <p className="text-xs text-slate-600">{scope.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expiration Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={newKey.expiresAt ? new Date(newKey.expiresAt).toISOString().slice(0, 16) : ""}
                onChange={(e) =>
                  setNewKey({
                    ...newKey,
                    expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Generate Key
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {keys.map((key) => (
            <div
              key={key.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="text-sm font-semibold text-slate-900">{key.name}</h5>
                    {getStatusBadge(key.status)}
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-slate-600">{maskKey(key.key)}</span>
                      <button
                        onClick={() => handleCopyKey(key.id, key.key)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {copiedKey === key.id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {key.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {key.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(key.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span>{" "}
                      {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : "Never"}
                    </div>
                    <div>
                      <span className="font-medium">Last Used:</span>{" "}
                      {key.lastUsed ? new Date(key.lastUsed).toLocaleString() : "Never"}
                    </div>
                    <div>
                      <span className="font-medium">Usage Count:</span> {key.usageCount.toLocaleString()}
                    </div>
                  </div>
                </div>
                {key.status === "active" && (
                  <button
                    onClick={() => handleRevokeKey(key.id)}
                    className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors ml-4"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

