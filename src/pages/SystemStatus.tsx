import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function SystemStatus() {
  const { user, userProfile, loading } = useAuth();
  const { permissions, hasPermission, loading: permissionsLoading } = usePermissions();

  if (loading || permissionsLoading) {
    return <div>Loading system status...</div>;
  }

  if (!user || !userProfile) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please log in to view system status.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            User Authentication
          </h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Name:</strong> {userProfile.full_name || 'Not set'}</p>
            <p><strong>Role:</strong> 
              <Badge className="ml-2">
                {userProfile.role.replace('_', ' ').toUpperCase()}
              </Badge>
            </p>
            <p><strong>Status:</strong> 
              <Badge variant="secondary" className="ml-2">
                {userProfile.status}
              </Badge>
            </p>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Permissions Overview
          </h2>
          <div className="space-y-2">
            <p><strong>Total Permissions:</strong> {permissions.length}</p>
            <div className="space-y-1">
              <p><strong>Key Permissions:</strong></p>
              <div className="flex flex-wrap gap-1">
                {['user_management', 'balance_management', 'sms_management'].map(perm => (
                  <Badge 
                    key={perm} 
                    variant={hasPermission(perm) ? "default" : "outline"}
                    className="text-xs"
                  >
                    {perm.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Integration Status */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>✅ System Implementation Complete:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Real database integration with Supabase</li>
            <li>Role-based permission system</li>
            <li>Permission groups and user management</li>
            <li>Creator-based impersonation rules</li>
            <li>Dynamic sidebar based on permissions</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}