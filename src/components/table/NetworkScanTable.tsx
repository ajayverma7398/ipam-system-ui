"use client";

import { useState } from "react";

export interface NetworkScanRow {
  id: string;
  ipAddress: string;
  status: "expected" | "new" | "unexpected";
  macAddress: string;
  hostname: string;
  openPorts: string;
  compareResult: {
    type: "match" | "misconfigured" | "not-found" | "misconfigured-but-in-use";
    message: string;
  };
  isSelected?: boolean;
  isPartiallySelected?: boolean;
}

interface NetworkScanTableProps {
  data: NetworkScanRow[];
  onSelect?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onClose?: () => void;
}

export default function NetworkScanTable({
  data,
  onSelect,
  onSelectAll,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 5,
  onPageChange,
  onClose,
}: NetworkScanTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [allSelected, setAllSelected] = useState(false);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    onSelectAll?.(checked);
  };

  const handleSelect = (id: string, checked: boolean) => {
    onSelect?.(id, checked);
  };

  const getStatusBadge = (status: NetworkScanRow["status"]) => {
    const styles = {
      expected: "bg-green-100 text-green-800",
      new: "bg-blue-100 text-blue-800",
      unexpected: "bg-orange-100 text-orange-800",
    };

    const labels = {
      expected: "Expected",
      new: "New",
      unexpected: "Unexpected",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getCompareIcon = (type: NetworkScanRow["compareResult"]["type"]) => {
    switch (type) {
      case "match":
      case "misconfigured-but-in-use":
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "misconfigured":
      case "not-found":
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left w-12"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                MAC Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Hostname
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Open Ports
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  Compare with IPAM DB
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={row.isSelected || false}
                    onChange={(e) => handleSelect(row.id, e.target.checked)}
                    className={`w-4 h-4 border-slate-300 rounded focus:ring-blue-500 ${
                      row.isPartiallySelected
                        ? "text-orange-600"
                        : row.isSelected
                        ? "text-blue-600"
                        : ""
                    }`}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleRow(row.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedRows.has(row.id) ? "rotate-90" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-slate-900">{row.ipAddress}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(row.status)}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-slate-700">{row.macAddress}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-700">{row.hostname || "(Unknown)"}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-700">{row.openPorts}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getCompareIcon(row.compareResult.type)}
                    <span className="text-sm text-slate-700">{row.compareResult.message}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {startItem} - {endItem} of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &gt;
            </button>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

