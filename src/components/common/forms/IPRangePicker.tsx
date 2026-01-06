"use client";

import { useState } from "react";
import FormInput from "./FormInput";

interface IPRangePickerProps {
  startIP: string;
  endIP: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onRangeChange?: (start: string, end: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

const validateIP = (ip: string): boolean => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;
  
  const parts = ip.split(".").map(Number);
  return parts.every(part => part >= 0 && part <= 255);
};

const ipToNumber = (ip: string): number => {
  const parts = ip.split(".").map(Number);
  return parts[0] * 256 * 256 * 256 + parts[1] * 256 * 256 + parts[2] * 256 + parts[3];
};

const detectNetworkClass = (ip: string): string => {
  const firstOctet = parseInt(ip.split(".")[0]);
  if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
  if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
  if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
  if (firstOctet >= 224 && firstOctet <= 239) return "Class D";
  if (firstOctet >= 240 && firstOctet <= 255) return "Class E";
  return "Unknown";
};

const PRESET_RANGES = [
  { label: "Class A Private", start: "10.0.0.1", end: "10.255.255.254" },
  { label: "Class B Private", start: "172.16.0.1", end: "172.31.255.254" },
  { label: "Class C Private", start: "192.168.0.1", end: "192.168.255.254" },
];

export default function IPRangePicker({
  startIP,
  endIP,
  onStartChange,
  onEndChange,
  onRangeChange,
  label = "IP Range",
  error,
  className = "",
}: IPRangePickerProps) {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const validateRange = (start: string, end: string): string | undefined => {
    if (!start || !end) return undefined;
    
    if (!validateIP(start)) {
      return "Invalid start IP address";
    }
    
    if (!validateIP(end)) {
      return "Invalid end IP address";
    }
    
    if (ipToNumber(start) > ipToNumber(end)) {
      return "Start IP must be less than or equal to end IP";
    }
    
    return undefined;
  };

  const handleStartChange = (value: string) => {
    onStartChange(value);
    const rangeError = validateRange(value, endIP);
    setLocalError(rangeError);
    if (!rangeError && value && endIP) {
      onRangeChange?.(value, endIP);
    }
  };

  const handleEndChange = (value: string) => {
    onEndChange(value);
    const rangeError = validateRange(startIP, value);
    setLocalError(rangeError);
    if (!rangeError && startIP && value) {
      onRangeChange?.(startIP, value);
    }
  };

  const handlePreset = (start: string, end: string) => {
    onStartChange(start);
    onEndChange(end);
    setLocalError(undefined);
    onRangeChange?.(start, end);
  };

  const networkClass = startIP ? detectNetworkClass(startIP) : null;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Start IP"
          type="text"
          value={startIP}
          onChange={(e) => handleStartChange(e.target.value)}
          placeholder="e.g., 10.0.0.1"
          error={localError?.includes("start") ? localError : undefined}
        />
        <FormInput
          label="End IP"
          type="text"
          value={endIP}
          onChange={(e) => handleEndChange(e.target.value)}
          placeholder="e.g., 10.0.0.100"
          error={localError?.includes("end") || localError?.includes("Start IP") ? localError : undefined}
        />
      </div>

      {networkClass && (
        <p className="mt-2 text-xs text-slate-500">
          Detected: {networkClass}
        </p>
      )}

      <div className="mt-4">
        <p className="text-xs font-medium text-slate-700 mb-2">Preset Ranges:</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_RANGES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePreset(preset.start, preset.end)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {error && !localError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

