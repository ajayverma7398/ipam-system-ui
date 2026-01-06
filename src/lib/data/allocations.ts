
import allocationsData from './allocations.json';

export type DeviceType = 'server' | 'router' | 'switch' | 'firewall' | 'vm' | 'container' | 'iot' | 'other';
export type AllocationStatus = 'allocated' | 'available' | 'reserved' | 'expired';

export interface AllocationMetadata {
  mac_address?: string;
  vlan?: string;
  owner?: string;
  department?: string;
  location?: string;
  service?: string;
}

export interface IPAllocation {
  id: string; 
  ip_address: string;
  pool_id: string; 
  hostname: string | null;
  device_id: string | null;
  device_type: DeviceType;
  status: AllocationStatus;
  allocated_by: string | null; 
  allocated_at: string | null; 
  expires_at: string | null; 
  description: string | null;
  tags: string[];
  metadata: AllocationMetadata;
}

export const allocations: IPAllocation[] = allocationsData as IPAllocation[];

export default allocations;

