
import settingsData from './settings.json';

export interface ScheduledReport {
  id: string;
  name: string;
  category: string;
  schedule: string;
  frequency: "daily" | "weekly" | "monthly";
  nextRun: string;
  lastRun?: string;
  lastRunStatus?: "success" | "failed" | "pending";
  recipients?: string[];
  isEnabled: boolean;
}

export interface SystemSettings {
  general: {
    site_name: string;
    default_lease_days: number;
    auto_allocation: boolean;
    notification_enabled: boolean;
    timezone?: string;
    date_format?: string;
    time_format?: string;
    language?: string;
    max_pool_size?: number;
    min_pool_size?: number;
    reserved_ip_count?: number;
    enable_audit_log?: boolean;
    audit_retention_days?: number;
  };
  network: {
    dns_servers: string[];
    ntp_servers: string[];
    default_gateway: string;
    default_subnet_mask?: string;
    vlan_enabled?: boolean;
    vlan_range?: {
      min: number;
      max: number;
    };
    mtu_size?: number;
    enable_ipv6?: boolean;
  };
  integrations: {
    dhcp_enabled: boolean;
    dhcp_server?: string;
    dhcp_port?: number;
    dns_enabled: boolean;
    dns_server?: string;
    dns_port?: number;
    monitoring_enabled: boolean;
    monitoring_endpoint?: string;
    monitoring_api_key?: string;
    api_enabled: boolean;
    api_base_url?: string;
    api_version?: string;
    api_rate_limit?: number;
    webhook_enabled?: boolean;
    webhook_url?: string;
    ldap_enabled?: boolean;
    ldap_server?: string;
    ldap_base_dn?: string;
    smtp_enabled?: boolean;
    smtp_server?: string;
    smtp_port?: number;
    smtp_from?: string;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    density: 'compact' | 'normal' | 'comfortable';
    refresh_interval: number;
    items_per_page?: number;
    default_sort_column?: string;
    default_sort_direction?: 'asc' | 'desc';
    show_advanced_options?: boolean;
    enable_tooltips?: boolean;
    enable_animations?: boolean;
    sidebar_collapsed?: boolean;
    dashboard_widgets?: string[];
  };
  alerts?: {
    utilization_warning_threshold: number;
    utilization_critical_threshold: number;
    expired_allocation_warning_days: number;
    expired_allocation_critical_days: number;
    email_notifications: boolean;
    email_recipients: string[];
    slack_notifications: boolean;
    slack_webhook: string;
    enable_system_alerts: boolean;
    enable_utilization_alerts: boolean;
    enable_expiry_alerts: boolean;
    enable_conflict_alerts: boolean;
  };
  backup?: {
    enabled: boolean;
    frequency: string;
    retention_days: number;
    backup_location: string;
    compress_backups: boolean;
    include_audit_logs: boolean;
    last_backup: string;
    next_backup: string;
  };
  security?: {
    password_min_length: number;
    password_require_uppercase: boolean;
    password_require_lowercase: boolean;
    password_require_numbers: boolean;
    password_require_symbols: boolean;
    session_timeout_minutes: number;
    max_login_attempts: number;
    lockout_duration_minutes: number;
    require_mfa: boolean;
    api_key_expiration_days: number;
    enable_ip_whitelist: boolean;
    ip_whitelist: string[];
  };
  reporting?: {
    default_report_format: string;
    available_formats: string[];
    report_retention_days: number;
    enable_scheduled_reports: boolean;
    scheduled_reports: ScheduledReport[];
    include_charts: boolean;
    include_tables: boolean;
    include_summary: boolean;
  };
  allocation?: {
    default_allocation_type: string;
    enable_auto_assign: boolean;
    reserve_gateway: boolean;
    reserve_broadcast: boolean;
    reserve_network: boolean;
    allow_overlap: boolean;
    require_hostname: boolean;
    require_device_id: boolean;
    default_expiry_days: number;
    max_bulk_allocation: number;
    enable_ip_validation: boolean;
    enable_cidr_validation: boolean;
  };
  metadata?: {
    last_updated: string;
    updated_by: string;
    version: string;
  };
}

export const settings: SystemSettings = settingsData as SystemSettings;
  
export default settings;

