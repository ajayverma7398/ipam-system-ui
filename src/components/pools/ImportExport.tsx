"use client";

import { useState, useRef } from "react";
import { useToast } from "@/components/ui";

interface ImportExportProps {
  onImportComplete?: () => void;
  onExportComplete?: () => void;
}

export function ImportExport({ onImportComplete, onExportComplete }: ImportExportProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const isJSON = file.name.endsWith(".json");
      
      if (isJSON) {
        const data = JSON.parse(text);
        showToast(`Imported ${data.length || 0} pools from JSON`, "success");
      } else {
        const lines = text.split("\n");
        showToast(`Imported ${lines.length - 1} pools from CSV`, "success");
      }
      
      onImportComplete?.();
    } catch {
      showToast("Failed to import pools. Please check the file format.", "error");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    setIsExporting(true);
    try {
      const poolsData: unknown[] = [];
      
      if (format === "json") {
        const jsonContent = JSON.stringify(poolsData, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pools-export-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const csvContent = [
          ["CIDR", "Type", "Total Hosts", "Allocated", "Available", "Utilization %"].join(","),
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pools-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      
      showToast(`Pools exported as ${format.toUpperCase()}`, "success");
      onExportComplete?.();
    } catch {
      showToast("Failed to export pools", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleImport}
        disabled={isImporting}
        className="px-4 py-2 text-slate-700 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
        title="Import pools from CSV or JSON"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {isImporting ? "Importing..." : "Import"}
      </button>

      <div className="relative group">
        <button
          onClick={() => handleExport("csv")}
          disabled={isExporting}
          className="px-4 py-2 text-slate-700 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
          title="Export pools as CSV"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isExporting ? "Exporting..." : "Export"}
        </button>
      </div>
    </div>
  );
}

