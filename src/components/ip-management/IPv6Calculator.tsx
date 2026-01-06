"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

export function IPv6Calculator() {
  const { showToast } = useToast();
  const [ipv6Address, setIpv6Address] = useState("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
  const [prefixLength, setPrefixLength] = useState(64);
  const [ipv4Address, setIpv4Address] = useState("192.168.1.1");

  const normalizeIPv6 = (ip: string): string => {
    return ip
      .split(":")
      .map((segment) => {
        if (segment === "") return "";
        const num = parseInt(segment, 16);
        return num.toString(16).toLowerCase();
      })
      .join(":");
  };

  const expandIPv6 = (ip: string): string => {
    const parts = ip.split("::");
    if (parts.length === 1) {
      return ip.split(":").map((p) => p.padStart(4, "0")).join(":");
    }

    const left = parts[0].split(":").filter(Boolean);
    const right = parts[1] ? parts[1].split(":").filter(Boolean) : [];
    const missing = 8 - left.length - right.length;

    const expanded = [
      ...left.map((p) => p.padStart(4, "0")),
      ...Array(missing).fill("0000"),
      ...right.map((p) => p.padStart(4, "0")),
    ];

    return expanded.join(":");
  };

  const abbreviateIPv6 = (ip: string): string => {
    const parts = ip.split(":");
    const normalized = parts.map((p) => {
      const num = parseInt(p, 16);
      return num.toString(16).toLowerCase();
    });

    let maxStart = -1;
    let maxLength = 0;
    let currentStart = -1;
    let currentLength = 0;

    normalized.forEach((part, index) => {
      if (part === "0" || part === "") {
        if (currentStart === -1) {
          currentStart = index;
          currentLength = 1;
        } else {
          currentLength++;
        }
        if (currentLength > maxLength) {
          maxLength = currentLength;
          maxStart = currentStart;
        }
      } else {
        currentStart = -1;
        currentLength = 0;
      }
    });

    if (maxLength > 1) {
      const before = normalized.slice(0, maxStart);
      const after = normalized.slice(maxStart + maxLength);
      return [...before, "", ...after].join(":");
    }

    return normalized.join(":");
  };

  const ipv4ToIPv6 = (ipv4: string): string => {
    const parts = ipv4.split(".").map(Number);
    const hex = parts.map((p) => p.toString(16).padStart(2, "0")).join("");
    return `2002:${hex.slice(0, 4)}:${hex.slice(4, 8)}::1`;
  };

  const ipv6Details = useMemo(() => {
    if (!ipv6Address) return null;

    try {
      const expanded = expandIPv6(ipv6Address);
      const abbreviated = abbreviateIPv6(expanded);
      const normalized = normalizeIPv6(expanded);

      const parts = expanded.split(":");
      const networkBits = prefixLength;
      const hostBits = 128 - networkBits;

      const totalAddresses = Math.pow(2, hostBits);

      return {
        expanded,
        abbreviated,
        normalized,
        networkBits,
        hostBits,
        totalAddresses,
        subnetMask: `/64`,
      };
    } catch {
      return null;
    }
  }, [ipv6Address, prefixLength]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`, "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">IPv6 Calculator</h3>
          <p className="text-sm text-slate-600">IPv6 CIDR calculations and conversion tools</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">IPv6 Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ipv6Address}
              onChange={(e) => setIpv6Address(e.target.value)}
              placeholder="2001:0db8:85a3::8a2e:0370:7334"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
            <input
              type="number"
              value={prefixLength}
              onChange={(e) => setPrefixLength(parseInt(e.target.value) || 64)}
              min={0}
              max={128}
              className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {ipv6Details && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Expanded Format</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono text-blue-900 break-all">{ipv6Details.expanded}</p>
                <button
                  onClick={() => handleCopy(ipv6Details.expanded, "Expanded format")}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Abbreviated Format</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono text-blue-900 break-all">{ipv6Details.abbreviated}</p>
                <button
                  onClick={() => handleCopy(ipv6Details.abbreviated, "Abbreviated format")}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Network Bits:</span>{" "}
                <span className="font-semibold text-blue-900">/{ipv6Details.networkBits}</span>
              </div>
              <div>
                <span className="text-blue-700">Host Bits:</span>{" "}
                <span className="font-semibold text-blue-900">{ipv6Details.hostBits}</span>
              </div>
              <div className="col-span-2">
                <span className="text-blue-700">Total Addresses:</span>{" "}
                <span className="font-semibold text-blue-900">
                  {ipv6Details.totalAddresses > 1e18
                    ? "2^" + ipv6Details.hostBits
                    : ipv6Details.totalAddresses.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-md font-semibold text-slate-900 mb-3">IPv4 to IPv6 Conversion</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">IPv4 Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ipv4Address}
                  onChange={(e) => setIpv4Address(e.target.value)}
                  placeholder="192.168.1.1"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
                <button
                  onClick={() => {
                    const converted = ipv4ToIPv6(ipv4Address);
                    setIpv6Address(converted);
                    showToast("IPv6 address generated", "success");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

