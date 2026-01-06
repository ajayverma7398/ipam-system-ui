# IPAM System Mock Data

This directory contains comprehensive mock data for the IP Address Management (IPAM) system. All data is realistic, consistent, and follows established patterns.

## Data Files

### TypeScript Modules (ES Modules)

All data is exported as ES modules with TypeScript interfaces:

- **`pools.ts`** - IP address pools (18 pools)
- **`allocations.ts`** - IP allocation records (100 allocations)
- **`activities.ts`** - Activity log entries (50 activities)
- **`dashboard.ts`** - Dashboard statistics and trends
- **`users.ts`** - User accounts (11 users)
- **`settings.ts`** - System configuration
- **`index.ts`** - Central export point for all data

### JSON Files (Source Data)

The JSON files serve as the source data that the TypeScript modules import from:

- **`pools.json`** - Raw pool data
- **`allocations.json`** - Raw allocation data
- **`activities.json`** - Raw activity data
- **`dashboard.json`** - Raw dashboard data
- **`users.json`** - Raw user data
- **`settings.json`** - Raw settings data

## ID Patterns

All IDs follow consistent patterns for easy identification:

- **Pools**: `pool-XXX` (001-018)
- **Allocations**: `alloc-XXX` (001-100)
- **Activities**: `act-XXX` (001-050)
- **Users**: `user-XXX` (001-011)

## Timestamp Format

All timestamps use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`

**Time Range**: 2022-12-01 to 2024-03-15

## Data Consistency

### Cross-References

- **Pool IDs**: Referenced in `allocations.json` (`pool_id`), `dashboard.json` (`top_utilized_pools.pool_id`), and `activities.json` (`pool_id`)
- **User Emails**: Referenced in `pools.json` (`created_by`), `allocations.json` (`allocated_by`), and `activities.json` (`user`)
- **Allocation IDs**: Referenced in `activities.json` (`allocation_id`)

### Validation Rules

- All IP addresses match their pool's CIDR range
- Expired allocations have `expires_at` in the past
- Available IPs have `null` for `allocated_by` and `allocated_at`
- Pool utilization percentages match allocated/available counts

## Edge Cases

The data includes various edge cases for comprehensive testing:

### Pools
- **High utilization**: `pool-006` (79.26% utilization)
- **Empty pool**: `pool-014` (0% utilization - multicast)
- **Low utilization**: `pool-018` (0.87% utilization)

### Allocations
- **Expired allocations**: Several allocations with `expires_at` in the past
- **Available IPs**: IPs with `status: "available"` and null allocation data
- **Reserved IPs**: IPs with `status: "reserved"` (gateways, network addresses)

### Activities
- **System alerts**: Different severity levels (info, warning, error)
- **IP conflicts**: Error-level alerts for IP address conflicts
- **Utilization warnings**: Warnings for pools exceeding thresholds

### Users
- **Inactive user**: `user-011` with `is_active: false`
- **Different roles**: admin, network_engineer, operator, viewer

## Usage

### Import All Data

```typescript
import { pools, allocations, activities, dashboardData, users, settings } from '@/lib/data';
```

### Import Specific Types

```typescript
import type { IPPool, IPAllocation, Activity, User, SystemSettings } from '@/lib/data';
```

### Import Individual Modules

```typescript
import { pools, type IPPool } from '@/lib/data/pools';
import { allocations, type IPAllocation } from '@/lib/data/allocations';
```

## Data Statistics

- **Total Pools**: 18
  - Private Class C: 5
  - Private Class B: 3
  - Private Class A: 2
  - Public: 3
  - Multicast: 2

- **Total Allocations**: 100
  - Allocated: ~70
  - Available: ~20
  - Reserved: ~5
  - Expired: ~5

- **Total Activities**: 50
  - IP Allocations: 30
  - IP Releases: 4
  - Pool Operations: 4
  - User Logins: 4
  - System Alerts: 8

- **Total Users**: 11
  - Admin: 1
  - Network Engineers: 4
  - Operators: 4
  - Viewers: 2

## Notes

- All data is mock data for development and testing purposes
- No real IP addresses or sensitive information
- Data follows realistic enterprise network scenarios
- Timestamps are chronological and span realistic time ranges
- All references between data files are consistent and valid

