"use client";

import { useState, useEffect } from "react";

export interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface SearchFilterProps {
  onSearch?: (term: string) => void;
  filters?: FilterOption[];
  onFilterChange?: (filters: Record<string, string>) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export default function SearchFilter({
  onSearch,
  filters = [],
  onFilterChange,
  placeholder = "Search...",
  debounceMs = 300,
  className = "",
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [searchTerm, debounceMs, onSearch]);

  useEffect(() => {
    onFilterChange?.(activeFilters);
  }, [activeFilters, onFilterChange]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilters({});
  };

  const activeFilterCount = Object.keys(activeFilters).length + (searchTerm ? 1 : 0);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b6cb0] focus:border-transparent bg-white"
            aria-label="Search"
          />
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Clear all filters"
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {filter.label}
              </label>
              <select
                value={activeFilters[filter.key] || ""}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b6cb0] focus:border-transparent bg-white"
                aria-label={`Filter by ${filter.label}`}
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

