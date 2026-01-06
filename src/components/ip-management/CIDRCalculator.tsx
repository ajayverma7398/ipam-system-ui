"use client";

import { useMemo } from "react";
import Card from "@/components/ui/Card";

interface CIDRCalculatorProps {
  cidr: string;
}

interface CIDRDetails {
  network: string;
  broadcast: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  networkBits: number;
  hostBits: number;
  ipClass: string;
  ipType: "private" | "public" | "multicast";
}

export function CIDRCalculator({ cidr }: CIDRCalculatorProps) {
  const details = useMemo<CIDRDetails | null>(() => {
    if (!cidr || !cidr.includes("/")) return null;

    try {
      const [ip, prefixLengthStr] = cidr.split("/");
      const prefixLength = parseInt(prefixLengthStr, 10);

      if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
        return null;
      }

      const ipParts = ip.split(".").map(Number);
      if (ipParts.length !== 4 || ipParts.some((part) => isNaN(part) || part < 0 || part > 255)) {
        return null;
      }

      const subnetMask = Array.from({ length: 4 }, (_, i) => {
        const bits = Math.min(8, Math.max(0, prefixLength - i * 8));
        return (0xff << (8 - bits)) & 0xff;
      });

      const network = ipParts.map((part, i) => part & subnetMask[i]);

      const wildcard = subnetMask.map((mask) => 255 - mask);
      const broadcast = network.map((part, i) => part | wildcard[i]);

      const hostBits = 32 - prefixLength;
      const totalHosts = Math.pow(2, hostBits);
      const usableHosts = Math.max(0, totalHosts - 2);

      const firstOctet = ipParts[0];
      let ipClass = "Unknown";
      if (firstOctet >= 1 && firstOctet <= 126) ipClass = "A";
      else if (firstOctet >= 128 && firstOctet <= 191) ipClass = "B";
      else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "C";
      else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "D";
      else if (firstOctet >= 240 && firstOctet <= 255) ipClass = "E";

      let ipType: "private" | "public" | "multicast" = "public";
      if (
        (firstOctet === 10) ||
        (firstOctet === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) ||
        (firstOctet === 192 && ipParts[1] === 168)
      ) {
        ipType = "private";
      } else if (firstOctet >= 224 && firstOctet <= 239) {
        ipType = "multicast";
      }

      return {
        network: network.join("."),
        broadcast: broadcast.join("."),
        subnetMask: subnetMask.join("."),
        wildcardMask: wildcard.join("."),
        totalHosts,
        usableHosts,
        networkBits: prefixLength,
        hostBits,
        ipClass,
        ipType,
      };
    } catch {
      return null;
    }
  }, [cidr]);

  if (!cidr || !cidr.includes("/")) {
    return (
      <Card>
        <p className="text-sm text-slate-500">Enter a valid CIDR notation to see calculation results</p>
      </Card>
    );
  }

  if (!details) {
    return (
      <Card>
        <p className="text-sm text-red-600">Invalid CIDR notation. Please check your input.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h4 className="text-md font-semibold text-slate-900 mb-4">CIDR Calculation Results</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Network Address</p>
          <p className="text-sm font-mono font-semibold text-slate-900">{details.network}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Broadcast Address</p>
          <p className="text-sm font-mono font-semibold text-slate-900">{details.broadcast}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Subnet Mask</p>
          <p className="text-sm font-mono font-semibold text-slate-900">{details.subnetMask}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Wildcard Mask</p>
          <p className="text-sm font-mono font-semibold text-slate-900">{details.wildcardMask}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Total Hosts</p>
          <p className="text-sm font-semibold text-slate-900">{details.totalHosts.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Usable Hosts</p>
          <p className="text-sm font-semibold text-slate-900">{details.usableHosts.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Network Bits</p>
          <p className="text-sm font-semibold text-slate-900">/ {details.networkBits}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Host Bits</p>
          <p className="text-sm font-semibold text-slate-900">{details.hostBits}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">IP Class</p>
          <p className="text-sm font-semibold text-slate-900">Class {details.ipClass}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">IP Type</p>
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              details.ipType === "private"
                ? "bg-blue-100 text-blue-800"
                : details.ipType === "public"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {details.ipType}
          </span>
        </div>
      </div>
    </Card>
  );
}

