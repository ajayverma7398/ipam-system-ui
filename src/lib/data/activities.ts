

import activitiesData from './activities.json';

export type ActivityType = 'ip_allocation' | 'ip_release' | 'pool_creation' | 'pool_deletion' | 'user_login' | 'system_alert';
export type ActivitySeverity = 'info' | 'warning' | 'error';

export interface Activity {
  id: string; 
  type: ActivityType;
  user: string; 
  timestamp: string; 
  description: string;
  details: Record<string, unknown>;
  ip_address?: string; 
  pool_id?: string; 
  severity?: ActivitySeverity;
}

export const activities: Activity[] = activitiesData as Activity[];

export default activities;

