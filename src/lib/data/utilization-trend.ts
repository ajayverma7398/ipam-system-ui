
import utilizationTrendData from './utilization-trend.json';

export interface UtilizationTrendPoint {
  date: string; 
  allocated: number;
  available: number;
  reserved: number;
}

export const utilizationTrend: UtilizationTrendPoint[] = utilizationTrendData as UtilizationTrendPoint[];

export default utilizationTrend;

