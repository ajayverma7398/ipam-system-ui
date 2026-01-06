"use client";

import { useState } from "react";
import { NetworkScanTable, NetworkScanRow } from "@/components/table";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

export default function NetworkScanPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sampleData: NetworkScanRow[] = [
    {
      id: "1",
      ipAddress: "10.0.20.11",
      status: "expected",
      macAddress: "00:1E:5C:9A:7B:8C",
      hostname: "dev-sensor02",
      openPorts: "443",
      compareResult: {
        type: "match",
        message: "Matches Expected Entry",
      },
      isSelected: selectedRows.has("1"),
    },
    {
      id: "2",
      ipAddress: "10.0.20.15",
      status: "new",
      macAddress: "00:02:34:45:56:67",
      hostname: "camera01",
      openPorts: "443",
      compareResult: {
        type: "misconfigured",
        message: "Misconfigured in IPAM Database",
      },
      isSelected: selectedRows.has("2"),
    },
    {
      id: "3",
      ipAddress: "10.0.0.70",
      status: "expected",
      macAddress: "90:E2:BA:E0:F0:01",
      hostname: "smart-sensor",
      openPorts: "80",
      compareResult: {
        type: "not-found",
        message: "Not found in IPAM Database",
      },
      isSelected: selectedRows.has("3"),
    },
    {
      id: "4",
      ipAddress: "10.20.1070",
      status: "unexpected",
      macAddress: "90:E2:BA:E0:F0:01",
      hostname: "(Unknown)",
      openPorts: "80",
      compareResult: {
        type: "not-found",
        message: "Not found in IPAM Database",
      },
      isSelected: selectedRows.has("4"),
    },
    {
      id: "5",
      ipAddress: "10.20.1070",
      status: "unexpected",
      macAddress: "00:1B:44:11:3A:B9",
      hostname: "(Unknown)",
      openPorts: "22, 53, 80",
      compareResult: {
        type: "misconfigured-but-in-use",
        message: "Misconfigured in IPAM DB But in use",
      },
      isPartiallySelected: true,
      isSelected: selectedRows.has("5"),
    },
    {
      id: "6",
      ipAddress: "192.168.1.10",
      status: "expected",
      macAddress: "00:1D:60:AB:CD:EF",
      hostname: "lab-printer",
      openPorts: "80,9100",
      compareResult: {
        type: "match",
        message: "Matches Expected Entry",
      },
      isSelected: selectedRows.has("6"),
    },
    {
      id: "7",
      ipAddress: "190.168.2.10",
      status: "expected",
      macAddress: "00:1D:60:AB:CD:EF",
      hostname: "lab-printer",
      openPorts: "80,9108",
      compareResult: {
        type: "match",
        message: "Matches Expected Entry",
      },
      isSelected: selectedRows.has("7"),
    },
  ];

  const handleSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(sampleData.map((row) => row.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sampleData.slice(startIndex, endIndex);

  const dataWithSelection = paginatedData.map((row) => ({
    ...row,
    isSelected: selectedRows.has(row.id),
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <main className="flex-1 overflow-y-auto">
        <div className="mb-6 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import Scan Results
            </button>
          </div>
        </div>

        <NetworkScanTable
          data={dataWithSelection}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sampleData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
        </main>
      </div>
  );
}

