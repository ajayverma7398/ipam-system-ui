"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui";

interface CIDRCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CIDRResults {
  network: string;
  broadcast: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  networkBits: number;
  hostBits: number;
  ipClass: string;
  ipType: string;
}

export default function CIDRCalculatorModal({ isOpen, onClose }: CIDRCalculatorModalProps) {
  const [cidr, setCidr] = useState("");
  const [results, setResults] = useState<CIDRResults | null>(null);
  const { showToast } = useToast();

  const calculateCIDR = () => {
    if (!cidr || !cidr.includes("/")) {
      showToast("Please enter a valid CIDR notation (e.g., 10.0.0.0/24)", "warning");
      return;
    }

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

    const firstOctet = networkParts[0];
    let ipClass = "Unknown";
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = "Class A";
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = "Class B";
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "Class C";
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "Class D";
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = "Class E";

    const ipType = networkParts[0] === 10 ||
      (networkParts[0] === 172 && networkParts[1] >= 16 && networkParts[1] <= 31) ||
      (networkParts[0] === 192 && networkParts[1] === 168)
      ? "Private"
      : "Public";

    setResults({
      network,
      broadcast: broadcast.join("."),
      subnetMask: mask.join("."),
      wildcardMask: mask.map((m) => 255 - m).join("."),
      totalHosts,
      usableHosts,
      networkBits: prefixLength,
      hostBits,
      ipClass,
      ipType,
    });
  };

  const copyResults = () => {
    if (!results) return;
    const text = Object.entries(results)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    showToast("Results copied to clipboard", "success");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CIDR Calculator" size="lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            CIDR Notation
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              placeholder="e.g., 10.0.0.0/24"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={calculateCIDR}
              className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              Calculate
            </button>
          </div>
        </div>

        {results && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Network</p>
                <p className="text-sm font-mono font-semibold text-slate-900">{results.network}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Broadcast</p>
                <p className="text-sm font-mono font-semibold text-slate-900">{results.broadcast}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Subnet Mask</p>
                <p className="text-sm font-mono font-semibold text-slate-900">{results.subnetMask}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Wildcard Mask</p>
                <p className="text-sm font-mono font-semibold text-slate-900">{results.wildcardMask}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Total Hosts</p>
                <p className="text-sm font-semibold text-slate-900">{results.totalHosts.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Usable Hosts</p>
                <p className="text-sm font-semibold text-slate-900">{results.usableHosts.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Network Bits</p>
                <p className="text-sm font-semibold text-slate-900">{results.networkBits}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">Host Bits</p>
                <p className="text-sm font-semibold text-slate-900">{results.hostBits}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">IP Class</p>
                <p className="text-sm font-semibold text-slate-900">{results.ipClass}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-600 mb-1">IP Type</p>
                <p className="text-sm font-semibold text-slate-900">{results.ipType}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-600 mb-2">Subnet Visualization</p>
              <div className="h-32 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 text-sm">
                Network visualization placeholder
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={copyResults}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Copy Results
              </button>
              <button
                onClick={() => {
                  showToast("Create Pool modal would open here", "info");
                }}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Create Pool
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

