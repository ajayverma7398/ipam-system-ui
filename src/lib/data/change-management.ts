import changeManagementData from "./change-management.json";

export interface ChangeTimelinePoint {
  date: string;
  successRate: number;
  successful: number;
  failed: number;
  total: number;
}

export interface ChangeStats {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
}

export interface ChangeImpactPoint {
  type: string;
  count: number;
  errors: number;
  warnings: number;
  successRate: number;
}

export interface ApprovalWorkflow {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  approvalRate: number;
}

export interface RollbackItem {
  timestamp: string;
  description: string;
  user: string;
}

export interface RollbackAnalysis {
  count: number;
  recent: RollbackItem[];
}

export interface ChangeManagementData {
  changeTimeline: {
    "7d": {
      all: ChangeTimelinePoint[];
      ip_allocation: ChangeTimelinePoint[];
      ip_release: ChangeTimelinePoint[];
      pool_creation: ChangeTimelinePoint[];
      pool_deletion: ChangeTimelinePoint[];
    };
    "30d": {
      all: ChangeTimelinePoint[];
      ip_allocation: ChangeTimelinePoint[];
      ip_release: ChangeTimelinePoint[];
      pool_creation: ChangeTimelinePoint[];
      pool_deletion: ChangeTimelinePoint[];
    };
    "90d": {
      all: ChangeTimelinePoint[];
      ip_allocation: ChangeTimelinePoint[];
      ip_release: ChangeTimelinePoint[];
      pool_creation: ChangeTimelinePoint[];
      pool_deletion: ChangeTimelinePoint[];
    };
  };
  changeStats: {
    "7d": {
      all: ChangeStats;
      ip_allocation: ChangeStats;
      ip_release: ChangeStats;
      pool_creation: ChangeStats;
      pool_deletion: ChangeStats;
    };
    "30d": {
      all: ChangeStats;
      ip_allocation: ChangeStats;
      ip_release: ChangeStats;
      pool_creation: ChangeStats;
      pool_deletion: ChangeStats;
    };
    "90d": {
      all: ChangeStats;
      ip_allocation: ChangeStats;
      ip_release: ChangeStats;
      pool_creation: ChangeStats;
      pool_deletion: ChangeStats;
    };
  };
  changeImpact: ChangeImpactPoint[];
  approvalWorkflow: ApprovalWorkflow;
  rollbackAnalysis: RollbackAnalysis;
}

export const changeManagement = changeManagementData as ChangeManagementData;

