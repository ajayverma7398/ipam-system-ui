
export interface Pool {
  cidr: string;
  network: string;
  type: "public" | "private";
  total: number;
  used: number;
  available: number;
  utilization: number;
}

export interface IPAddress {
  ip: string;
  status: "available" | "reserved" | "allocated" | "pending" | "system";
  hostname?: string;
  device?: string;
  allocatedDate?: string;
  description?: string;
}

export interface Activity {
  id: string;
  timestamp: string;
  type: "allocation" | "release" | "pool_created" | "pool_deleted";
  message: string;
  user: string;
}

export const mockPools: Pool[] = [
  {
    cidr: "10.0.0.0/16",
    network: "10.0.0.0",
    type: "private",
    total: 65536,
    used: 1234,
    available: 64302,
    utilization: 1.88,
  },
  {
    cidr: "172.16.0.0/20",
    network: "172.16.0.0",
    type: "private",
    total: 4096,
    used: 892,
    available: 3204,
    utilization: 21.78,
  },
  {
    cidr: "192.168.1.0/24",
    network: "192.168.1.0",
    type: "private",
    total: 256,
    used: 156,
    available: 100,
    utilization: 60.94,
  },
  {
    cidr: "203.0.113.0/24",
    network: "203.0.113.0",
    type: "public",
    total: 256,
    used: 89,
    available: 167,
    utilization: 34.77,
  },
  {
    cidr: "198.51.100.0/24",
    network: "198.51.100.0",
    type: "public",
    total: 256,
    used: 45,
    available: 211,
    utilization: 17.58,
  },
];

export const mockIPs: Record<string, IPAddress[]> = {
  "10.0.0.0/16": [
    { ip: "10.0.0.1", status: "system", hostname: "gateway", device: "router-01" },
    { ip: "10.0.0.2", status: "allocated", hostname: "server-01", device: "svr-001", allocatedDate: "2024-01-15" },
    { ip: "10.0.0.3", status: "allocated", hostname: "server-02", device: "svr-002", allocatedDate: "2024-01-20" },
    { ip: "10.0.0.4", status: "reserved", hostname: "reserved-01", description: "Reserved for future use" },
    { ip: "10.0.0.5", status: "available" },
  ],
  "172.16.0.0/20": [
    { ip: "172.16.0.1", status: "system", hostname: "gateway" },
    { ip: "172.16.0.2", status: "allocated", hostname: "db-01", device: "db-001", allocatedDate: "2024-02-01" },
    { ip: "172.16.0.3", status: "available" },
  ],
};

export const mockActivities: Activity[] = [
  {
    id: "1",
    timestamp: "2024-03-15T10:30:00Z",
    type: "allocation",
    message: "Allocated 10.0.0.5 to server-03",
    user: "admin@example.com",
  },
  {
    id: "2",
    timestamp: "2024-03-15T09:15:00Z",
    type: "pool_created",
    message: "Created pool 192.168.2.0/24",
    user: "admin@example.com",
  },
  {
    id: "3",
    timestamp: "2024-03-14T16:45:00Z",
    type: "release",
    message: "Released 172.16.0.10",
    user: "user@example.com",
  },
  {
    id: "4",
    timestamp: "2024-03-14T14:20:00Z",
    type: "allocation",
    message: "Allocated 10.0.0.6 to server-04",
    user: "admin@example.com",
  },
];

export const dashboardMetrics = {
  totalPools: mockPools.length,
  publicPools: mockPools.filter((p) => p.type === "public").length,
  privatePools: mockPools.filter((p) => p.type === "private").length,
  allocatedIPs: mockPools.reduce((sum, p) => sum + p.used, 0),
  freeIPs: mockPools.reduce((sum, p) => sum + p.available, 0),
  totalIPs: mockPools.reduce((sum, p) => sum + p.total, 0),
  utilization: mockPools.reduce((sum, p) => sum + p.utilization, 0) / mockPools.length,
};

