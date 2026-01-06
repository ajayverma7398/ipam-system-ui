"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface CloudAccount {
  id: string;
  name: string;
  provider: "aws" | "azure" | "gcp";
  region: string;
  accessKey: string;
  secretKey: string;
  enabled: boolean;
  syncVPCs: boolean;
  syncIPs: boolean;
}

interface CloudConfig {
  enabled: boolean;
  accounts: CloudAccount[];
  costOptimization: boolean;
  autoSync: boolean;
  syncInterval: number; 
}

export function CloudIntegration() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<CloudConfig>({
    enabled: false,
    accounts: [
      {
        id: "cloud-001",
        name: "AWS Production",
        provider: "aws",
        region: "us-east-1",
        accessKey: "",
        secretKey: "",
        enabled: true,
        syncVPCs: true,
        syncIPs: true,
      },
    ],
    costOptimization: false,
    autoSync: true,
    syncInterval: 24,
  });

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<CloudAccount>>({
    name: "",
    provider: "aws",
    region: "us-east-1",
    accessKey: "",
    secretKey: "",
    enabled: true,
    syncVPCs: true,
    syncIPs: true,
  });

  const handleSave = () => {
    showToast("Cloud integration settings saved successfully", "success");
  };

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.accessKey) {
      showToast("Please fill in account name and access key", "error");
      return;
    }
    const account: CloudAccount = {
      id: `cloud-${Date.now()}`,
      name: newAccount.name,
      provider: newAccount.provider || "aws",
      region: newAccount.region || "us-east-1",
      accessKey: newAccount.accessKey,
      secretKey: newAccount.secretKey || "",
      enabled: newAccount.enabled ?? true,
      syncVPCs: newAccount.syncVPCs ?? true,
      syncIPs: newAccount.syncIPs ?? true,
    };
    setConfig({
      ...config,
      accounts: [...config.accounts, account],
    });
    setNewAccount({
      name: "",
      provider: "aws",
      region: "us-east-1",
      accessKey: "",
      secretKey: "",
      enabled: true,
      syncVPCs: true,
      syncIPs: true,
    });
    setIsAddingAccount(false);
    showToast("Cloud account added", "success");
  };

  const toggleAccount = (id: string) => {
    setConfig({
      ...config,
      accounts: config.accounts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    });
  };

  const removeAccount = (id: string) => {
    setConfig({
      ...config,
      accounts: config.accounts.filter((a) => a.id !== id),
    });
    showToast("Cloud account removed", "success");
  };

  const providers = [
    { value: "aws", label: "Amazon Web Services (AWS)", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
    { value: "azure", label: "Microsoft Azure", regions: ["eastus", "westus2", "westeurope"] },
    { value: "gcp", label: "Google Cloud Platform (GCP)", regions: ["us-central1", "europe-west1", "asia-east1"] },
  ];

  const getProviderLabel = (provider: string) => {
    return providers.find((p) => p.value === provider)?.label || provider.toUpperCase();
  };

  const getProviderRegions = (provider: string) => {
    return providers.find((p) => p.value === provider)?.regions || [];
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Cloud Integration</h3>
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
              <p className="text-sm font-medium text-slate-900">Enable Cloud Integration</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-slate-900">Cloud Accounts</h4>
                <button
                  onClick={() => setIsAddingAccount(!isAddingAccount)}
                  className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {isAddingAccount ? "Cancel" : "+ Add Account"}
                </button>
              </div>

              {isAddingAccount && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Account Name</label>
                      <input
                        type="text"
                        value={newAccount.name || ""}
                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        placeholder="e.g., AWS Production"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cloud Provider</label>
                      <select
                        value={newAccount.provider || "aws"}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            provider: e.target.value as CloudAccount["provider"],
                            region: getProviderRegions(e.target.value)[0] || "",
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {providers.map((provider) => (
                          <option key={provider.value} value={provider.value}>
                            {provider.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Region</label>
                      <select
                        value={newAccount.region || ""}
                        onChange={(e) => setNewAccount({ ...newAccount, region: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {getProviderRegions(newAccount.provider || "aws").map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Access Key ID / App ID
                      </label>
                      <input
                        type="text"
                        value={newAccount.accessKey || ""}
                        onChange={(e) => setNewAccount({ ...newAccount, accessKey: e.target.value })}
                        placeholder="Access key or application ID"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Secret Key / API Key
                      </label>
                      <input
                        type="password"
                        value={newAccount.secretKey || ""}
                        onChange={(e) => setNewAccount({ ...newAccount, secretKey: e.target.value })}
                        placeholder="Secret key or API key"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setIsAddingAccount(false)}
                      className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAccount}
                      className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                    >
                      Add Account
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {config.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="text-sm font-semibold text-slate-900">{account.name}</h5>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              account.enabled
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {account.enabled ? "Enabled" : "Disabled"}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {getProviderLabel(account.provider)}
                          </span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium font-mono">
                            {account.region}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span className={account.syncVPCs ? "text-green-700" : "text-slate-400"}>
                            {account.syncVPCs ? "✓" : "✗"} Sync VPCs/VNets
                          </span>
                          <span className={account.syncIPs ? "text-green-700" : "text-slate-400"}>
                            {account.syncIPs ? "✓" : "✗"} Sync IPs
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleAccount(account.id)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            account.enabled
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {account.enabled ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => removeAccount(account.id)}
                          className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Synchronization Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block mb-1">Auto-Sync</span>
                    <span className="text-xs text-slate-600">
                      Automatically synchronize with cloud platforms at scheduled intervals
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.autoSync}
                    onChange={(e) => setConfig({ ...config, autoSync: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                {config.autoSync && (
                  <div className="ml-8">
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={config.syncInterval}
                        onChange={(e) => setConfig({ ...config, syncInterval: Number(e.target.value) })}
                        className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-sm text-slate-700">hours</span>
                      <p className="text-xs text-slate-500">
                        How often to synchronize with cloud platforms
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Cost Optimization</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.costOptimization}
                    onChange={(e) => setConfig({ ...config, costOptimization: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Cost Optimization</p>
                    <p className="text-xs text-slate-600">
                      Analyze cloud IP usage and provide recommendations for cost savings
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

