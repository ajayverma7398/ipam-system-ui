import allocationStatsData from "./allocation-stats.json";

export interface AllocationDataPoint {
  date: string;
  allocations: number;
}

export interface AllocationStatsData {
  "7d": AllocationDataPoint[];
  "30d": AllocationDataPoint[];
  "90d": AllocationDataPoint[];
  "1y": AllocationDataPoint[];
}

export const allocationStats = allocationStatsData as AllocationStatsData;

