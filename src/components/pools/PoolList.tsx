"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/common/data-display";
import { UtilizationBar } from "@/components/common/data-display";
import { type IPPool } from "@/lib/data/pools";
import Card from "@/components/ui/Card";

interface PoolListProps {
  pools: IPPool[];
  onPoolClick?: (pool: IPPool) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  pageSize?: number;
}

export function PoolList({
  pools: poolData,
  onPoolClick,
  selectable = false,
  onSelectionChange,
  pageSize = 10,
}: PoolListProps) {
  const router = useRouter();
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const selectedPoolIds = useMemo(() => {
    return new Set(
      Array.from(selectedIndices)
        .map((index) => poolData[index]?.id || poolData[index]?.cidr || "")
        .filter(Boolean)
    );
  }, [selectedIndices, poolData]);

  useEffect(() => {
    onSelectionChange?.(selectedPoolIds);
  }, [selectedPoolIds, onSelectionChange]);

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      public: "bg-green-100 text-green-800",
      private: "bg-blue-100 text-blue-800",
      multicast: "bg-purple-100 text-purple-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          typeColors[type] || "bg-slate-100 text-slate-800"
        }`}
      >
        {type}
      </span>
    );
  };

  const columns: Column<IPPool>[] = [
    {
      key: "cidr",
      label: "CIDR",
      sortable: true,
      render: (value: unknown, row: IPPool) => (
        <button
          onClick={() => {
            onPoolClick?.(row);
            router.push(`/dashboard/pools/${encodeURIComponent(row.cidr)}`);
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
        >
          {value as string}
        </button>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: unknown) => getTypeBadge(value as string),
    },
    {
      key: "total_hosts",
      label: "Size",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{(value as number).toLocaleString()}</span>
      ),
    },
    {
      key: "utilization",
      label: "Utilization",
      sortable: true,
      render: (_: unknown, row: IPPool) => (
        <div className="flex items-center gap-2 min-w-[150px]">
          <span className="text-sm font-semibold text-slate-900 w-12">
            {row.utilization.percentage.toFixed(1)}%
          </span>
          <UtilizationBar
            used={row.utilization.allocated}
            total={row.total_hosts}
            showPercentage={false}
          />
        </div>
      ),
    },
    {
      key: "allocation",
      label: "Allocated/Total",
      sortable: true,
      render: (_: unknown, row: IPPool) => (
        <span className="text-sm text-slate-900">
          {row.utilization.allocated.toLocaleString()} / {row.total_hosts.toLocaleString()}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: unknown, row: IPPool) => (
        <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/pools/${encodeURIComponent(row.cidr)}`);
              }}
              className="text-blue-600 cursor-pointer hover:text-blue-700 p-1 rounded transition-colors"
              title="View details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/pools/${encodeURIComponent(row.cidr)}/edit`);
            }}
            className="text-slate-600 cursor-pointer hover:text-slate-700 p-1 rounded transition-colors"
            title="Edit pool"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const handleSelectionChange = (selectedIndices: Set<number>) => {
    setSelectedIndices(selectedIndices);
  };

  return (
    <Card>
      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={poolData as unknown as Record<string, unknown>[]}
        selectable={selectable}
        pagination={{ pageSize }}
        onSelectionChange={handleSelectionChange}
        onRowClick={(row) => {
          const pool = row as unknown as IPPool;
          onPoolClick?.(pool);
          router.push(`/dashboard/pools/${encodeURIComponent(pool.cidr)}`);
        }}
        emptyMessage="No pools found. Create your first pool to get started."
      />
    </Card>
  );
}

