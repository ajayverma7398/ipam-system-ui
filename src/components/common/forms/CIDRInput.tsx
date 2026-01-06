"use client";

import { useState } from "react";
import FormInput from "./FormInput";

interface CIDRInputProps {
  value: string;
  onChange: (value: string) => void;
  onCalculate?: (details: CIDRDetails) => void;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface CIDRDetails {
  network: string;
  broadcast: string;
  subnetMask: string;
  totalHosts: number;
  usableHosts: number;
}

const validateCIDR = (cidr: string): { valid: boolean; error?: string } => {
  if (!cidr) return { valid: false, error: "CIDR notation is required" };
  
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  if (!cidrRegex.test(cidr)) {
    return { valid: false, error: "Invalid CIDR format. Use format: 192.168.1.0/24" };
  }

  const [ip, prefix] = cidr.split("/");
  const prefixNum = parseInt(prefix);
  
  if (prefixNum < 0 || prefixNum > 32) {
    return { valid: false, error: "Prefix length must be between 0 and 32" };
  }

  const parts = ip.split(".").map(Number);
  if (parts.some(part => part < 0 || part > 255)) {
    return { valid: false, error: "Invalid IP address. Each octet must be 0-255" };
  }

  return { valid: true };
};

const calculateCIDR = (cidr: string): CIDRDetails | null => {
  const validation = validateCIDR(cidr);
  if (!validation.valid) return null;

  const [network, prefix] = cidr.split("/");
  const prefixLength = parseInt(prefix);
  const hostBits = 32 - prefixLength;
  const totalHosts = Math.pow(2, hostBits);
  const usableHosts = totalHosts - 2;

  const mask = [];
  for (let i = 0; i < 4; i++) {
    if (prefixLength > i * 8 + 8) {
      mask.push(255);
    } else if (prefixLength > i * 8) {
      const bits = prefixLength - i * 8;
      mask.push(256 - Math.pow(2, 8 - bits));
    } else {
      mask.push(0);
    }
  }

  const networkParts = network.split(".").map(Number);
  const broadcast = networkParts.map((oct, i) => {
    if (prefixLength <= i * 8) return 255;
    if (prefixLength >= (i + 1) * 8) return oct;
    const bits = prefixLength - i * 8;
    return oct | (Math.pow(2, 8 - bits) - 1);
  });

  return {
    network,
    broadcast: broadcast.join("."),
    subnetMask: mask.join("."),
    totalHosts,
    usableHosts,
  };
};

export default function CIDRInput({
  value,
  onChange,
  onCalculate,
  label = "CIDR Notation",
  error,
  required = false,
  className = "",
}: CIDRInputProps) {
  const [localError, setLocalError] = useState<string | undefined>(error);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    const validation = validateCIDR(newValue);
    setLocalError(validation.error);
  };

  const handleCalculate = () => {
    const validation = validateCIDR(value);
    if (!validation.valid) {
      setLocalError(validation.error);
      return;
    }

    setIsCalculating(true);
    const details = calculateCIDR(value);
    
    if (details) {
      onCalculate?.(details);
      setLocalError(undefined);
    } else {
      setLocalError("Unable to calculate CIDR details");
    }
    
    setTimeout(() => setIsCalculating(false), 300);
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            label={label}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="e.g., 10.0.0.0/24"
            error={error || localError}
            required={required}
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!value || isCalculating}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shadow-lg"
            aria-label="Calculate CIDR details"
          >
            {isCalculating ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </div>
    </div>
  );
}

