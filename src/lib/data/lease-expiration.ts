import leaseExpirationData from "./lease-expiration.json";

export interface ExpirationPatternPoint {
  days: number;
  label: string;
  count: number;
}

export interface LeaseExpirationData {
  "7d": ExpirationPatternPoint[];
  "30d": ExpirationPatternPoint[];
  "90d": ExpirationPatternPoint[];
}

export const leaseExpiration = leaseExpirationData as LeaseExpirationData;

