
import dashboardData from './dashboard.json';

export interface DashboardStats {
  total_pools: number;
  public_pools: number;
  private_pools: number;
  multicast_pools?: number;
  allocated_ips: number;
  free_ips: number;
  total_ips?: number;
  utilization_rate: number;
  active_users: number;
  recent_allocations: number;
}

export interface TopUtilizedPool {
  cidr: string;
  utilization: number;
  allocated: number;
  total: number;
  type: string;
  pool_id: string; 
}

export interface UtilizationTrendPoint {
  date: string; 
  allocated: number;
  available: number;
  reserved: number;
}

export interface RecentActivity {
  id: string;
  timestamp: string; 
  type: string;
  message: string;
  user: string; 
  ip_address?: string;
  pool_id?: string; 
}

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string; 
  pool_id?: string; 
  ip_address?: string;
  severity?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  top_utilized_pools: TopUtilizedPool[];
  utilization_trend: UtilizationTrendPoint[];
  recent_activities: RecentActivity[];
  alerts: DashboardAlert[];
}

export const dashboard: DashboardData = dashboardData as DashboardData;

export default dashboard;

