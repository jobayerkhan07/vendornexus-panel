// Permission and role management types

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  targetRole: UserRole;
  permissions: string[];
  createdBy: string;
  createdAt: string;
  isDefault: boolean;
}

export type UserRole = 'super_admin' | 'admin' | 'reseller' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  createdBy?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  permissions: string[];
  permissionGroupId?: string;
}

// All available permissions in the system (60 total)
export const SYSTEM_PERMISSIONS: Permission[] = [
  // User Management (10 permissions)
  { id: 'users.view', name: 'View Users', description: 'View user list and details', category: 'User Management', enabled: true },
  { id: 'users.create', name: 'Create Users', description: 'Create new users', category: 'User Management', enabled: true },
  { id: 'users.edit', name: 'Edit Users', description: 'Edit user details', category: 'User Management', enabled: true },
  { id: 'users.delete', name: 'Delete Users', description: 'Delete users', category: 'User Management', enabled: true },
  { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend/unsuspend users', category: 'User Management', enabled: true },
  { id: 'users.export', name: 'Export Users', description: 'Export user data', category: 'User Management', enabled: true },
  { id: 'users.import', name: 'Import Users', description: 'Import user data', category: 'User Management', enabled: true },
  { id: 'users.roles', name: 'Manage User Roles', description: 'Assign roles to users', category: 'User Management', enabled: true },
  { id: 'users.permissions', name: 'Manage User Permissions', description: 'Assign permissions to users', category: 'User Management', enabled: true },
  { id: 'users.audit', name: 'User Audit Logs', description: 'View user activity logs', category: 'User Management', enabled: true },

  // SMS Services (10 permissions)
  { id: 'sms.send', name: 'Send SMS', description: 'Send SMS messages', category: 'SMS Services', enabled: true },
  { id: 'sms.bulk', name: 'Bulk SMS', description: 'Send bulk SMS campaigns', category: 'SMS Services', enabled: true },
  { id: 'sms.templates', name: 'SMS Templates', description: 'Manage SMS templates', category: 'SMS Services', enabled: true },
  { id: 'sms.history', name: 'SMS History', description: 'View SMS sending history', category: 'SMS Services', enabled: true },
  { id: 'sms.reports', name: 'SMS Reports', description: 'Generate SMS reports', category: 'SMS Services', enabled: true },
  { id: 'sms.numbers', name: 'Manage SMS Numbers', description: 'Manage sender numbers', category: 'SMS Services', enabled: true },
  { id: 'sms.routes', name: 'SMS Routes', description: 'Configure SMS routes', category: 'SMS Services', enabled: true },
  { id: 'sms.api', name: 'SMS API Access', description: 'Access SMS API endpoints', category: 'SMS Services', enabled: true },
  { id: 'sms.pricing', name: 'SMS Pricing', description: 'Manage SMS pricing', category: 'SMS Services', enabled: true },
  { id: 'sms.dlr', name: 'SMS Delivery Reports', description: 'View delivery reports', category: 'SMS Services', enabled: true },

  // Number Pool (8 permissions)
  { id: 'numbers.view', name: 'View Numbers', description: 'View number pool', category: 'Number Pool', enabled: true },
  { id: 'numbers.purchase', name: 'Purchase Numbers', description: 'Purchase new numbers', category: 'Number Pool', enabled: true },
  { id: 'numbers.release', name: 'Release Numbers', description: 'Release numbers', category: 'Number Pool', enabled: true },
  { id: 'numbers.assign', name: 'Assign Numbers', description: 'Assign numbers to users', category: 'Number Pool', enabled: true },
  { id: 'numbers.configure', name: 'Configure Numbers', description: 'Configure number settings', category: 'Number Pool', enabled: true },
  { id: 'numbers.port', name: 'Port Numbers', description: 'Port numbers from other providers', category: 'Number Pool', enabled: true },
  { id: 'numbers.reports', name: 'Number Reports', description: 'Generate number usage reports', category: 'Number Pool', enabled: true },
  { id: 'numbers.inventory', name: 'Number Inventory', description: 'Manage number inventory', category: 'Number Pool', enabled: true },

  // Vendors (8 permissions)
  { id: 'vendors.view', name: 'View Vendors', description: 'View vendor list', category: 'Vendors', enabled: true },
  { id: 'vendors.create', name: 'Create Vendors', description: 'Add new vendors', category: 'Vendors', enabled: true },
  { id: 'vendors.edit', name: 'Edit Vendors', description: 'Edit vendor details', category: 'Vendors', enabled: true },
  { id: 'vendors.delete', name: 'Delete Vendors', description: 'Remove vendors', category: 'Vendors', enabled: true },
  { id: 'vendors.apis', name: 'Vendor APIs', description: 'Manage vendor API configurations', category: 'Vendors', enabled: true },
  { id: 'vendors.rates', name: 'Vendor Rates', description: 'Manage vendor rates', category: 'Vendors', enabled: true },
  { id: 'vendors.performance', name: 'Vendor Performance', description: 'View vendor performance metrics', category: 'Vendors', enabled: true },
  { id: 'vendors.settlements', name: 'Vendor Settlements', description: 'Manage vendor settlements', category: 'Vendors', enabled: true },

  // Financial (8 permissions)
  { id: 'billing.view', name: 'View Billing', description: 'View billing information', category: 'Financial', enabled: true },
  { id: 'billing.manage', name: 'Manage Billing', description: 'Manage billing settings', category: 'Financial', enabled: true },
  { id: 'payments.view', name: 'View Payments', description: 'View payment history', category: 'Financial', enabled: true },
  { id: 'payments.process', name: 'Process Payments', description: 'Process payments', category: 'Financial', enabled: true },
  { id: 'invoices.generate', name: 'Generate Invoices', description: 'Generate invoices', category: 'Financial', enabled: true },
  { id: 'pricing.manage', name: 'Manage Pricing', description: 'Manage service pricing', category: 'Financial', enabled: true },
  { id: 'credits.manage', name: 'Manage Credits', description: 'Manage user credits', category: 'Financial', enabled: true },
  { id: 'financial.reports', name: 'Financial Reports', description: 'Generate financial reports', category: 'Financial', enabled: true },

  // Reports & Analytics (8 permissions)
  { id: 'reports.view', name: 'View Reports', description: 'View system reports', category: 'Reports', enabled: true },
  { id: 'reports.create', name: 'Create Reports', description: 'Create custom reports', category: 'Reports', enabled: true },
  { id: 'reports.export', name: 'Export Reports', description: 'Export reports', category: 'Reports', enabled: true },
  { id: 'analytics.view', name: 'View Analytics', description: 'View analytics dashboard', category: 'Reports', enabled: true },
  { id: 'analytics.advanced', name: 'Advanced Analytics', description: 'Access advanced analytics', category: 'Reports', enabled: true },
  { id: 'metrics.system', name: 'System Metrics', description: 'View system performance metrics', category: 'Reports', enabled: true },
  { id: 'logs.access', name: 'Access Logs', description: 'View system logs', category: 'Reports', enabled: true },
  { id: 'audits.view', name: 'View Audits', description: 'View audit trails', category: 'Reports', enabled: true },

  // System Administration (8 permissions)
  { id: 'system.settings', name: 'System Settings', description: 'Manage system settings', category: 'System', enabled: true },
  { id: 'system.maintenance', name: 'System Maintenance', description: 'System maintenance mode', category: 'System', enabled: true },
  { id: 'system.backup', name: 'System Backup', description: 'Manage system backups', category: 'System', enabled: true },
  { id: 'system.security', name: 'Security Settings', description: 'Manage security settings', category: 'System', enabled: true },
  { id: 'system.monitoring', name: 'System Monitoring', description: 'Monitor system health', category: 'System', enabled: true },
  { id: 'system.notifications', name: 'System Notifications', description: 'Manage system notifications', category: 'System', enabled: true },
  { id: 'system.integrations', name: 'System Integrations', description: 'Manage third-party integrations', category: 'System', enabled: true },
  { id: 'system.api', name: 'System API Access', description: 'Full system API access', category: 'System', enabled: true },
];

// Default permission sets for each role
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: SYSTEM_PERMISSIONS.map(p => p.id), // All permissions
  admin: [
    // User Management (8/10)
    'users.view', 'users.create', 'users.edit', 'users.suspend', 'users.export', 'users.roles', 'users.permissions', 'users.audit',
    // SMS Services (8/10)
    'sms.send', 'sms.bulk', 'sms.templates', 'sms.history', 'sms.reports', 'sms.numbers', 'sms.api', 'sms.dlr',
    // Number Pool (6/8)
    'numbers.view', 'numbers.purchase', 'numbers.assign', 'numbers.configure', 'numbers.reports', 'numbers.inventory',
    // Vendors (6/8)
    'vendors.view', 'vendors.create', 'vendors.edit', 'vendors.apis', 'vendors.rates', 'vendors.performance',
    // Financial (6/8)
    'billing.view', 'billing.manage', 'payments.view', 'invoices.generate', 'pricing.manage', 'credits.manage',
    // Reports (6/8)
    'reports.view', 'reports.create', 'reports.export', 'analytics.view', 'metrics.system', 'audits.view',
  ], // 40 permissions
  reseller: [
    // User Management (4/10)
    'users.view', 'users.create', 'users.edit', 'users.roles',
    // SMS Services (6/10)
    'sms.send', 'sms.bulk', 'sms.templates', 'sms.history', 'sms.reports', 'sms.api',
    // Number Pool (3/8)
    'numbers.view', 'numbers.assign', 'numbers.reports',
    // Vendors (2/8)
    'vendors.view', 'vendors.performance',
    // Financial (3/8)
    'billing.view', 'payments.view', 'credits.manage',
    // Reports (2/8)
    'reports.view', 'analytics.view',
  ], // 20 permissions
  user: [
    // SMS Services (4/10)
    'sms.send', 'sms.templates', 'sms.history', 'sms.api',
    // Number Pool (2/8)
    'numbers.view', 'numbers.reports',
    // Financial (1/8)
    'billing.view',
    // Reports (1/8)
    'reports.view',
  ], // 8 permissions
};