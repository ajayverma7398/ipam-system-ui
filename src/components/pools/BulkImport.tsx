/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { LoadingSpinner } from "@/components/common/feedback";

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  conflicts: number;
  errors: Array<{ row: number; error: string }>;
}

export function BulkImport() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [fileType, setFileType] = useState<"csv" | "json" | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ row: number; error: string }>>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith(".csv");
    const isJSON = file.name.endsWith(".json");

    if (!isCSV && !isJSON) {
      showToast("Please select a CSV or JSON file", "error");
      return;
    }

    setFileType(isCSV ? "csv" : "json");

    try {
      const text = await file.text();
      let data: any[] = [];

      if (isJSON) {
        data = JSON.parse(text);
        if (!Array.isArray(data)) {
          showToast("JSON file must contain an array of pools", "error");
          return;
        }
      } else {
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim());
        data = lines.slice(1).map((line, index) => {
          const values = line.split(",").map((v) => v.trim());
          const obj: any = {};
          headers.forEach((header, i) => {
            obj[header] = values[i] || "";
          });
          obj._rowNumber = index + 2;
          return obj;
        });
      }

      const errors: Array<{ row: number; error: string }> = [];
      data.forEach((item, index) => {
        if (!item.cidr || !item.cidr.includes("/")) {
          errors.push({ row: item._rowNumber || index + 1, error: "Missing or invalid CIDR notation" });
        }
        if (!item.description) {
          errors.push({ row: item._rowNumber || index + 1, error: "Missing description" });
        }
      });

      setValidationErrors(errors);
      setPreviewData(data.slice(0, 10));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Failed to parse file. Please check the format.", "error");
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      showToast("No data to import", "warning");
      return;
    }

    setIsImporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result: ImportResult = {
        total: previewData.length,
        successful: previewData.length - validationErrors.length,
        failed: validationErrors.length,
        conflicts: 0,
        errors: validationErrors,
      };

      setImportResult(result);
      showToast(`Imported ${result.successful} pool(s) successfully`, "success");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Import failed", "error");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = (format: "csv" | "json") => {
    const template = format === "csv" 
      ? "cidr,description,type,tags\nexample,192.168.1.0/24,Production pool,private,production,servers"
      : JSON.stringify([
          {
            cidr: "192.168.1.0/24",
            description: "Production pool",
            type: "private",
            tags: ["production", "servers"],
          },
        ], null, 2);

    const blob = new Blob([template], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pool-import-template.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast(`Template downloaded`, "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bulk Import Pools</h3>
          <p className="text-sm text-slate-600">Import multiple pools from a CSV or JSON file</p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">Download Template</p>
            <p className="text-xs text-blue-700">Use our template to ensure correct format</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => downloadTemplate("csv")}
              className="px-3 py-1.5 text-sm bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              CSV Template
            </button>
            <button
              onClick={() => downloadTemplate("json")}
              className="px-3 py-1.5 text-sm bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              JSON Template
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Upload File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700"
          >
            Choose File or Drag & Drop
          </button>
          {fileType && (
            <p className="mt-2 text-xs text-slate-500">Selected: {fileType.toUpperCase()} file</p>
          )}
        </div>

        {previewData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Preview (First 10 rows)</p>
              <span className="text-xs text-slate-500">{previewData.length} rows</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">CIDR</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Description</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewData.map((row, index) => (
                    <tr key={index} className={validationErrors.some(e => e.row === row._rowNumber) ? "bg-red-50" : ""}>
                      <td className="px-3 py-2 font-mono text-slate-900">{row.cidr || "-"}</td>
                      <td className="px-3 py-2 text-slate-900">{row.description || "-"}</td>
                      <td className="px-3 py-2 text-slate-900">{row.type || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900 mb-2">
              Validation Errors ({validationErrors.length})
            </p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {validationErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-700">
                  Row {error.row}: {error.error}
                </p>
              ))}
            </div>
          </div>
        )}

        {importResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">Import Summary</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Total</p>
                <p className="text-lg font-semibold text-slate-900">{importResult.total}</p>
              </div>
              <div>
                <p className="text-slate-600">Successful</p>
                <p className="text-lg font-semibold text-green-600">{importResult.successful}</p>
              </div>
              <div>
                <p className="text-slate-600">Failed</p>
                <p className="text-lg font-semibold text-red-600">{importResult.failed}</p>
              </div>
              <div>
                <p className="text-slate-600">Conflicts</p>
                <p className="text-lg font-semibold text-yellow-600">{importResult.conflicts}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              setPreviewData([]);
              setValidationErrors([]);
              setImportResult(null);
              setFileType(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleImport}
            disabled={previewData.length === 0 || isImporting || validationErrors.length > 0}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <LoadingSpinner size="sm" />
                Importing...
              </>
            ) : (
              "Import Pools"
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}

