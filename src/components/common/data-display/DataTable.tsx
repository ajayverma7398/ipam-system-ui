"use client";

import { useState, ReactNode } from "react";


export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
}

export interface Action<T = Record<string, unknown>> {
  label: string;
  onClick: (row: T) => void;
  icon?: ReactNode;
  variant?: "primary" | "danger" | "default";
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  sortable?: boolean;
  pagination?: {
    pageSize?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
  };
  actions?: Action<T>[];
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: Set<number>) => void;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  selectable = false,
  sortable = true,
  pagination,
  actions = [],
  onRowClick,
  onSelectionChange,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const pageSize = pagination?.pageSize || 10;

  const handleSort = (key: string) => {
    if (!sortable) return;
    
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key] as string | number;
    const bValue = b[sortConfig.key] as string | number;
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue > bValue ? 1 : -1;
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked
      ? new Set(paginatedData.map((_, index) => startIndex + index))
      : new Set<number>();
    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination?.onPageChange?.(page);
  };

  if (data.length === 0) {
    return (
      <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-12 text-center ${className}`}>
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden w-full max-w-full min-w-0 ${className}`}>
      <div className="overflow-x-auto w-full max-w-full min-w-0">
        <table className="w-full" style={{ minWidth: 'max-content' }}>
          <thead className="bg-slate-50/50 border-b border-white/20">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
                    column.sortable && sortable ? "cursor-pointer hover:bg-slate-100" : ""
                  } ${column.className || ""}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && sortable && sortConfig?.key === column.key && (
                      <svg
                        className={`w-4 h-4 ${sortConfig.direction === "asc" ? "" : "rotate-180"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white/95 divide-y divide-white/20">
            {paginatedData.map((row, index) => {
              const globalIndex = startIndex + index;
              return (
                <tr
                  key={globalIndex}
                  className={`hover:bg-slate-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(globalIndex)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(globalIndex, e.target.checked);
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        aria-label={`Select row ${globalIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={`px-4 py-4 ${column.className || ""}`}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : <div className="text-sm text-slate-900">{String(row[column.key] || "-")}</div>
                      }
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                              action.variant === "danger"
                                ? "text-red-700 bg-red-50 hover:bg-red-100"
                                : action.variant === "primary"
                                ? "text-blue-700 bg-blue-50 hover:bg-blue-100"
                                : "text-slate-700 bg-slate-50 hover:bg-slate-100"
                            }`}
                            aria-label={action.label}
                          >
                            {action.icon || action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="bg-slate-50/50 border-t border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {startIndex + 1} - {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    page === currentPage
                      ? "bg-[#2b6cb0] text-white"
                      : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

