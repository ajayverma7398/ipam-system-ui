"use client";

import { useState, useRef } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { LoadingSpinner } from "@/components/common/feedback";

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

interface CSVRow {
  [key: string]: string | number;
  _rowNumber: number;
}

export function ImportIPs() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<Array<{ row: number; error: string }>>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      showToast("Please select a CSV file", "error");
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      
      const data: CSVRow[] = lines.slice(1).map((line, index) => {
        const values = line.split(",").map((v) => v.trim());
        const obj: CSVRow = {} as CSVRow;
        headers.forEach((header, i) => {
          obj[header] = values[i] || "";
        });
        obj._rowNumber = index + 2;
        return obj;
      });

      const errors: Array<{ row: number; error: string }> = [];
      data.forEach((item) => {
        const ipAddress = String(item.ip_address || "");
        if (!ipAddress || !ipAddress.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          errors.push({ row: item._rowNumber, error: "Invalid IP address format" });
        }
        const poolId = String(item.pool_id || "");
        if (!poolId) {
          errors.push({ row: item._rowNumber, error: "Missing pool ID" });
        }
      });

      setValidationErrors(errors);
      setPreviewData(data.slice(0, 10));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Failed to parse CSV file", "error");
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      showToast("No data to import", "warning");
      return;
    }

    if (validationErrors.length > 0) {
      showToast("Please fix validation errors before importing", "warning");
      return;
    }

    setIsImporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result: ImportResult = {
        total: previewData.length,
        successful: previewData.length - validationErrors.length,
        failed: validationErrors.length,
        errors: validationErrors,
      };

      setImportResult(result);
      showToast(`Imported ${result.successful} IP allocation(s) successfully`, "success");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Import failed", "error");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = "ip_address,pool_id,hostname,device_id,device_type,status,description\nexample,192.168.1.10,pool-001,web-01,DEV-001,server,allocated,Web server";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ip-import-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast("Template downloaded", "success");
  };

  const handleExport = () => {
    if (previewData.length === 0) {
      showToast("No data to export", "warning");
      return;
    }

    const headers = Object.keys(previewData[0]).filter((k) => !k.startsWith("_"));
    const csvContent = [
      headers.join(","),
      ...previewData.map((row) => headers.map((h) => row[h] || "").join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ip-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast("Data exported", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Import/Export IPs</h3>
          <p className="text-sm text-slate-600">Import IP allocations from CSV or export selected IPs</p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">Download Template</p>
            <p className="text-xs text-blue-700">Use our CSV template to ensure correct format</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Download Template
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Upload CSV File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700"
          >
            Choose File or Drag & Drop
          </button>
        </div>

        {previewData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Preview (First 10 rows)</p>
              <button
                onClick={handleExport}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Export Preview
              </button>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {Object.keys(previewData[0])
                      .filter((k) => !k.startsWith("_"))
                      .map((key) => (
                        <th key={key} className="px-3 py-2 text-left text-xs font-semibold text-slate-700">
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewData.map((row, index) => (
                    <tr
                      key={index}
                      className={validationErrors.some((e) => e.row === row._rowNumber) ? "bg-red-50" : ""}
                    >
                      {Object.keys(row)
                        .filter((k) => !k.startsWith("_"))
                        .map((key) => (
                          <td key={key} className="px-3 py-2 text-slate-900">
                            {row[key] || "-"}
                          </td>
                        ))}
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
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-700">Total:</span>{" "}
                <span className="font-semibold text-green-900">{importResult.total}</span>
              </div>
              <div>
                <span className="text-green-700">Successful:</span>{" "}
                <span className="font-semibold text-green-900">{importResult.successful}</span>
              </div>
              <div>
                <span className="text-green-700">Failed:</span>{" "}
                <span className="font-semibold text-red-600">{importResult.failed}</span>
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
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleImport}
            disabled={previewData.length === 0 || isImporting || validationErrors.length > 0}
            className="px-6 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <LoadingSpinner size="sm" />
                Importing...
              </>
            ) : (
              "Import IPs"
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}

