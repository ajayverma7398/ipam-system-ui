"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui";

interface SearchResult {
  ip: string;
  status: string;
  hostname: string;
  device: string;
  pool: string;
}

interface SearchIPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchIPModal({ isOpen, onClose }: SearchIPModalProps) {
  const [searchType, setSearchType] = useState<"ip" | "hostname" | "device" | "status" | "pool">("ip");
  const [searchValue, setSearchValue] = useState("");
  const [ipMatchType, setIpMatchType] = useState<"contains" | "exact" | "range">("contains");
  const [results, setResults] = useState<SearchResult[]>([]);
  const { showToast } = useToast();

  const handleSearch = () => {
    if (!searchValue) {
      showToast("Please enter a search term", "warning");
      return;
    }
    setResults([
      { ip: "10.0.0.1", status: "allocated", hostname: "server-01", device: "svr-001", pool: "10.0.0.0/16" },
      { ip: "10.0.0.2", status: "allocated", hostname: "server-02", device: "svr-002", pool: "10.0.0.0/16" },
    ]);
    showToast("Search completed", "success");
  };

  const handleExport = () => {
    if (results.length === 0) {
      showToast("No results to export", "warning");
      return;
    }
    showToast("Results exported successfully", "success");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search & Find IP" size="xl">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search By
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "ip" | "hostname" | "device" | "status" | "pool")}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ip">IP Address</option>
              <option value="hostname">Hostname</option>
              <option value="device">Device ID</option>
              <option value="status">Status</option>
              <option value="pool">Pool</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Value
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter search term..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {searchType === "ip" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Match Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="contains"
                  checked={ipMatchType === "contains"}
                  onChange={(e) => setIpMatchType(e.target.value as "contains" | "exact" | "range")}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Contains</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="exact"
                  checked={ipMatchType === "exact"}
                  onChange={(e) => setIpMatchType(e.target.value as "contains" | "exact" | "range")}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Exact</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="range"
                  checked={ipMatchType === "range"}
                  onChange={(e) => setIpMatchType(e.target.value as "contains" | "exact" | "range")}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Range</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Search
          </button>
          {results.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Export Results
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Hostname</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Pool</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {results.map((result, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-900">{result.ip}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {result.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{result.hostname}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{result.device}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{result.pool}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

