import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Shield, Lock, Unlock, Filter } from "lucide-react";
import { SYSTEM_PERMISSIONS, Permission, UserRole, DEFAULT_ROLE_PERMISSIONS } from "@/types/permissions";

const currentUserRole: UserRole = "super_admin"; // Mock current user role

const groupPermissionsByCategory = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

const getRoleCount = (permissionId: string): number => {
  return Object.values(DEFAULT_ROLE_PERMISSIONS).filter(permissions => 
    permissions.includes(permissionId)
  ).length;
};

const getRolesWithPermission = (permissionId: string): UserRole[] => {
  return Object.entries(DEFAULT_ROLE_PERMISSIONS)
    .filter(([_, permissions]) => permissions.includes(permissionId))
    .map(([role, _]) => role as UserRole);
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "super_admin": return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "admin": return "bg-gradient-to-r from-blue-500 to-cyan-500";
    case "reseller": return "bg-gradient-to-r from-green-500 to-emerald-500";
    case "user": return "bg-gradient-to-r from-orange-500 to-yellow-500";
    default: return "bg-muted";
  }
};

export default function SystemPermissions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [enabledOnly, setEnabledOnly] = useState(false);

  const categorizedPermissions = groupPermissionsByCategory(SYSTEM_PERMISSIONS);
  const categories = Object.keys(categorizedPermissions);

  const filteredPermissions = SYSTEM_PERMISSIONS.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || permission.category === categoryFilter;
    const matchesRole = roleFilter === "all" || getRolesWithPermission(permission.id).includes(roleFilter);
    const matchesEnabled = !enabledOnly || permission.enabled;
    
    return matchesSearch && matchesCategory && matchesRole && matchesEnabled;
  });

  const filteredCategorizedPermissions = groupPermissionsByCategory(filteredPermissions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Permissions</h1>
          <p className="text-muted-foreground">View all available permissions and their role assignments</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{SYSTEM_PERMISSIONS.length}</div>
            <p className="text-xs text-muted-foreground">System-wide permissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Permission categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enabled</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {SYSTEM_PERMISSIONS.filter(p => p.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Active permissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disabled</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {SYSTEM_PERMISSIONS.filter(p => !p.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Inactive permissions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Registry</CardTitle>
          <CardDescription>
            Complete list of all system permissions and their role assignments
          </CardDescription>
          
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={(value: UserRole | "all") => setRoleFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="reseller">Reseller</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enabledOnly"
                checked={enabledOnly}
                onCheckedChange={(checked) => setEnabledOnly(!!checked)}
              />
              <Label htmlFor="enabledOnly">Enabled only</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPermissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No permissions found matching the current filters.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(filteredCategorizedPermissions).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {category}
                      <Badge variant="secondary">{permissions.length} permissions</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {permissions.map((permission) => {
                        const rolesWithPermission = getRolesWithPermission(permission.id);
                        const roleCount = getRoleCount(permission.id);
                        
                        return (
                          <div
                            key={permission.id}
                            className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{permission.name}</h4>
                                  <Badge 
                                    variant={permission.enabled ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {permission.enabled ? "Enabled" : "Disabled"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
                                </p>
                                <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                                  {permission.id}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Assigned to roles:</Label>
                                <Badge variant="outline" className="text-xs">
                                  {roleCount} role{roleCount !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {rolesWithPermission.length > 0 ? (
                                  rolesWithPermission.map((role) => (
                                    <Badge 
                                      key={role} 
                                      className={`text-white text-xs ${getRoleColor(role)}`}
                                    >
                                      {role.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">No roles assigned</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}