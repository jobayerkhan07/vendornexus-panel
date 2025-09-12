import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Search, Shield, Edit, Save, X, Filter, Users } from "lucide-react";
import { UserProfile, SYSTEM_PERMISSIONS, UserRole, Permission } from "@/types/permissions";

// Mock user data
const mockUsers: UserProfile[] = [
  {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    permissions: ["users.view", "users.create", "users.edit", "sms.send", "sms.bulk", "reports.view"],
    createdBy: "super-admin",
    createdAt: "2024-01-15",
    status: "active",
    lastLogin: "2024-01-25"
  },
  {
    id: "2",
    email: "reseller@example.com", 
    role: "reseller",
    permissions: ["users.view", "users.create", "sms.send", "reports.view"],
    createdBy: "admin-1",
    createdAt: "2024-01-20",
    status: "active",
    lastLogin: "2024-01-24"
  },
  {
    id: "3",
    email: "user@example.com",
    role: "user",
    permissions: ["sms.send", "sms.templates", "reports.view"],
    createdBy: "reseller-1",
    createdAt: "2024-01-22",
    status: "active"
  }
];

const currentUserRole: UserRole = "admin"; // Mock current user role

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "super_admin": return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "admin": return "bg-gradient-to-r from-blue-500 to-cyan-500";
    case "reseller": return "bg-gradient-to-r from-green-500 to-emerald-500";
    case "user": return "bg-gradient-to-r from-orange-500 to-yellow-500";
    default: return "bg-muted";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success text-success-foreground";
    case "inactive": return "bg-muted text-muted-foreground";
    case "suspended": return "bg-danger text-danger-foreground";
    default: return "bg-muted";
  }
};

const groupPermissionsByCategory = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

export default function UserPermissions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const categorizedPermissions = groupPermissionsByCategory(SYSTEM_PERMISSIONS);

  const handleEditPermissions = (user: UserProfile) => {
    setEditingUser(user);
    setEditingPermissions(user.permissions);
    setIsEditDialogOpen(true);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setEditingPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (!editingUser) return;
    
    // Here you would typically call an API to update user permissions
    console.log("Updating permissions for user:", editingUser.email, editingPermissions);
    
    setIsEditDialogOpen(false);
    setEditingUser(null);
    setEditingPermissions([]);
  };

  const columns = [
    { 
      key: "email" as const, 
      label: "User",
      render: (value: string, row: UserProfile) => (
        <div>
          <div className="font-medium">{value}</div>
          <Badge className={`text-white text-xs ${getRoleColor(row.role)}`}>
            {row.role.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      )
    },
    { 
      key: "permissions" as const, 
      label: "Permissions",
      render: (value: string[]) => (
        <div className="space-y-1">
          <Badge variant="secondary">{value.length} permissions</Badge>
          <div className="text-xs text-muted-foreground">
            {value.slice(0, 3).map(p => SYSTEM_PERMISSIONS.find(sp => sp.id === p)?.name).join(", ")}
            {value.length > 3 && ` +${value.length - 3} more`}
          </div>
        </div>
      )
    },
    { 
      key: "status" as const, 
      label: "Status",
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    { 
      key: "lastLogin" as const, 
      label: "Last Login",
      render: (value?: string) => (
        <span className="text-sm text-muted-foreground">
          {value ? new Date(value).toLocaleDateString() : "Never"}
        </span>
      )
    },
    {
      key: "id" as const,
      label: "Actions",
      render: (_: any, row: UserProfile) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleEditPermissions(row)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Permissions
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Permissions</h1>
          <p className="text-muted-foreground">Manage individual user permissions and access levels</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">Managed users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter(u => u.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{SYSTEM_PERMISSIONS.length}</div>
            <p className="text-xs text-muted-foreground">Total permissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(categorizedPermissions).length}
            </div>
            <p className="text-xs text-muted-foreground">Permission categories</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Permission Management</CardTitle>
          <CardDescription>
            View and modify user permissions individually
          </CardDescription>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value: UserRole | "all") => setRoleFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="reseller">Reseller</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={filteredUsers} columns={columns} />
        </CardContent>
      </Card>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Permissions - {editingUser?.email}</DialogTitle>
            <DialogDescription>
              Modify the permissions for this user. Changes will take effect immediately.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{editingUser.email}</div>
                  <Badge className={`text-white ${getRoleColor(editingUser.role)}`}>
                    {editingUser.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <Badge variant="secondary">{editingPermissions.length} permissions selected</Badge>
              </div>

              {Object.entries(categorizedPermissions).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={editingPermissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSavePermissions}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}