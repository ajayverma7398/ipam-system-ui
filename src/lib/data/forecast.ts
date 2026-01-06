
import forecastData from './forecast.json';

export interface ForecastDataPoint {
  month: string;
  utilization: number;
  availableIPs: number;
  projected: number;
  optimistic: number;
  pessimistic: number;
}

export const forecast: ForecastDataPoint[] = forecastData;

export default forecast;

