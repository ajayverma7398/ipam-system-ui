"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface NetworkConfig {
  defaultDNSServers: string[];
  defaultGateway: string;
  ntpServers: string[];
  domainName: string;
  searchDomains: string[];
}

export function NetworkConfiguration() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<NetworkConfig>({
    defaultDNSServers: ["8.8.8.8", "8.8.4.4"],
    defaultGateway: "192.168.1.1",
    ntpServers: ["pool.ntp.org", "time.google.com"],
    domainName: "example.local",
    searchDomains: ["example.local", "internal.example.local"],
  });

  const handleSave = () => {
    showToast("Network configuration saved successfully", "success");
  };

  const addDNSServer = (value: string) => {
    if (!value.trim()) return;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(value.trim())) {
      showToast("Invalid IP address format", "error");
      return;
    }
    setConfig({
      ...config,
      defaultDNSServers: [...config.defaultDNSServers, value.trim()],
    });
  };

  const removeDNSServer = (index: number) => {
    setConfig({
      ...config,
      defaultDNSServers: config.defaultDNSServers.filter((_, i) => i !== index),
    });
  };

  const addNTPServer = (value: string) => {
    if (!value.trim()) return;
    setConfig({
      ...config,
      ntpServers: [...config.ntpServers, value.trim()],
    });
  };

  const removeNTPServer = (index: number) => {
    setConfig({
      ...config,
      ntpServers: config.ntpServers.filter((_, i) => i !== index),
    });
  };

  const addSearchDomain = (value: string) => {
    if (!value.trim()) return;
    setConfig({
      ...config,
      searchDomains: [...config.searchDomains, value.trim()],
    });
  };

  const removeSearchDomain = (index: number) => {
    setConfig({
      ...config,
      searchDomains: config.searchDomains.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Global Network Settings</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Default DNS Servers</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g., 8.8.8.8"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDNSServer(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input) {
                  addDNSServer(input.value);
                  input.value = "";
                }
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.defaultDNSServers.map((server, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono"
              >
                {server}
                <button
                  onClick={() => removeDNSServer(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            DNS servers will be assigned to new IP allocations by default
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Default Gateway</h4>
          <input
            type="text"
            value={config.defaultGateway}
            onChange={(e) => setConfig({ ...config, defaultGateway: e.target.value })}
            placeholder="e.g., 192.168.1.1"
            className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Default gateway IP address for new network configurations
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">NTP Servers</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g., pool.ntp.org"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNTPServer(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input) {
                  addNTPServer(input.value);
                  input.value = "";
                }
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.ntpServers.map((server, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {server}
                <button
                  onClick={() => removeNTPServer(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            NTP servers for time synchronization
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Domain Name</h4>
          <input
            type="text"
            value={config.domainName}
            onChange={(e) => setConfig({ ...config, domainName: e.target.value })}
            placeholder="e.g., example.local"
            className="w-full md:w-96 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Default domain name for new IP allocations
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">DNS Search Domains</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g., internal.example.local"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSearchDomain(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input) {
                  addSearchDomain(input.value);
                  input.value = "";
                }
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.searchDomains.map((domain, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {domain}
                <button
                  onClick={() => removeSearchDomain(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            DNS search domains for hostname resolution
          </p>
        </div>
      </div>
    </Card>
  );
}

