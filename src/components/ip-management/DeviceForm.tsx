"use client";

import { useState } from "react";
import { FormInput } from "@/components/common/forms";
import type { AllocationTemplate } from "./AllocationWizard";

interface DeviceFormProps {
  hostname: string;
  deviceType: string;
  deviceId: string;
  macAddress: string;
  description: string;
  notes: string;
  metadata: Record<string, string>;
  template?: AllocationTemplate;
  onUpdate: (updates: Partial<{
    hostname: string;
    deviceType: string;
    deviceId: string;
    macAddress: string;
    description: string;
    notes: string;
    metadata: Record<string, string>;
  }>) => void;
}

const deviceTypes = [
  { value: "server", label: "Server" },
  { value: "router", label: "Router" },
  { value: "switch", label: "Switch" },
  { value: "firewall", label: "Firewall" },
  { value: "vm", label: "Virtual Machine" },
  { value: "container", label: "Container" },
  { value: "iot", label: "IoT Device" },
  { value: "other", label: "Other" },
];

export function DeviceForm({
  hostname,
  deviceType,
  deviceId,
  macAddress,
  description,
  notes,
  metadata,
  template,
  onUpdate,
}: DeviceFormProps) {
  const [dnsValid, setDnsValid] = useState<boolean | null>(null);
  const [macValid, setMacValid] = useState<boolean | null>(null);
  const [customKey, setCustomKey] = useState("");
  const [customValue, setCustomValue] = useState("");

  const validateDNS = (hostname: string) => {
    const dnsRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return dnsRegex.test(hostname);
  };

  const validateMAC = (mac: string) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const handleHostnameChange = (value: string) => {
    onUpdate({ hostname: value });
    if (value) {
      setDnsValid(validateDNS(value));
    } else {
      setDnsValid(null);
    }
  };

  const handleMACChange = (value: string) => {
    onUpdate({ macAddress: value });
    if (value) {
      setMacValid(validateMAC(value));
    } else {
      setMacValid(null);
    }
  };

  const addMetadata = () => {
    if (customKey && customValue) {
      onUpdate({
        metadata: { ...metadata, [customKey]: customValue },
      });
      setCustomKey("");
      setCustomValue("");
    }
  };

  const removeMetadata = (key: string) => {
    const newMetadata = { ...metadata };
    delete newMetadata[key];
    onUpdate({ metadata: newMetadata });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Device Information</h3>
        <p className="text-sm text-slate-600">Enter details about the device receiving this IP</p>
      </div>

      {template && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">Using template: {template.name}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Hostname <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={hostname}
            onChange={(e) => handleHostnameChange(e.target.value)}
            placeholder={template?.hostnamePrefix ? `${template.hostnamePrefix}-01` : "e.g., web-server-01"}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              dnsValid === false ? "border-red-300" : dnsValid === true ? "border-green-300" : "border-slate-300"
            }`}
            required
          />
          {dnsValid !== null && (
            <div className="absolute right-3 top-2.5">
              {dnsValid ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          )}
        </div>
        {dnsValid === false && (
          <p className="mt-1 text-xs text-red-600">Invalid hostname format</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Device Type <span className="text-red-500">*</span>
          </label>
          <select
            value={deviceType}
            onChange={(e) => onUpdate({ deviceType: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {deviceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FormInput
            label="Device ID"
            type="text"
            value={deviceId}
            onChange={(e) => onUpdate({ deviceId: e.target.value })}
            placeholder="e.g., DEV-001"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">MAC Address</label>
        <div className="relative">
          <input
            type="text"
            value={macAddress}
            onChange={(e) => handleMACChange(e.target.value)}
            placeholder="e.g., 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
              macValid === false ? "border-red-300" : macValid === true ? "border-green-300" : "border-slate-300"
            }`}
          />
          {macValid !== null && (
            <div className="absolute right-3 top-2.5">
              {macValid ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          )}
        </div>
        {macValid === false && (
          <p className="mt-1 text-xs text-red-600">Invalid MAC address format (use XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX)</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe the purpose of this allocation..."
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Additional notes or comments..."
          rows={2}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Custom Metadata</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            placeholder="Key"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Value"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addMetadata}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Add
          </button>
        </div>
        {Object.keys(metadata).length > 0 && (
          <div className="space-y-2">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-sm">
                  <span className="font-medium text-slate-900">{key}:</span>{" "}
                  <span className="text-slate-600">{value}</span>
                </span>
                <button
                  onClick={() => removeMetadata(key)}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

