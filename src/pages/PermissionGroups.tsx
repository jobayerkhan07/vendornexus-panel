import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Shield, Users, Copy } from "lucide-react";
import { PermissionGroup, SYSTEM_PERMISSIONS, UserRole, Permission } from "@/types/permissions";

// Mock data for permission groups
const mockPermissionGroups: PermissionGroup[] = [
  {
    id: "1",
    name: "Admin Standard",
    description: "Standard admin permissions with user management and reporting",
    targetRole: "admin",
    permissions: ["users.view", "users.create", "users.edit", "sms.send", "sms.bulk", "reports.view"],
    createdBy: "super-admin",
    createdAt: "2024-01-15",
    isDefault: true
  },
  {
    id: "2", 
    name: "Reseller Basic",
    description: "Basic reseller permissions for user management",
    targetRole: "reseller",
    permissions: ["users.view", "users.create", "sms.send", "reports.view"],
    createdBy: "super-admin",
    createdAt: "2024-01-15",
    isDefault: true
  },
  {
    id: "3",
    name: "User SMS Only",
    description: "User access limited to SMS services only",
    targetRole: "user",
    permissions: ["sms.send", "sms.templates", "sms.history"],
    createdBy: "admin-1",
    createdAt: "2024-01-20",
    isDefault: false
  }
];

const currentUserRole: UserRole = "super_admin"; // Mock current user role

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "super_admin": return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "admin": return "bg-gradient-to-r from-blue-500 to-cyan-500";
    case "reseller": return "bg-gradient-to-r from-green-500 to-emerald-500";
    case "user": return "bg-gradient-to-r from-orange-500 to-yellow-500";
    default: return "bg-muted";
  }
};

const canManageRole = (targetRole: UserRole): boolean => {
  if (currentUserRole === "super_admin") return true;
  if (currentUserRole === "admin" && (targetRole === "reseller" || targetRole === "user")) return true;
  if (currentUserRole === "reseller" && targetRole === "user") return true;
  return false;
};

const getAvailableRoles = (): UserRole[] => {
  if (currentUserRole === "super_admin") return ["admin", "reseller", "user"];
  if (currentUserRole === "admin") return ["reseller", "user"];
  if (currentUserRole === "reseller") return ["user"];
  return [];
};

const groupCategories = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

export default function PermissionGroups() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const availableRoles = getAvailableRoles();
  const categorizedPermissions = groupCategories(SYSTEM_PERMISSIONS);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleCreateGroup = () => {
    // Here you would typically call an API to create the permission group
    console.log("Creating permission group:", {
      name: groupName,
      description: groupDescription,
      targetRole: selectedRole,
      permissions: selectedPermissions
    });
    setIsCreateDialogOpen(false);
    setGroupName("");
    setGroupDescription("");
    setSelectedPermissions([]);
  };

  const columns = [
    { key: "name" as const, label: "Group Name" },
    { 
      key: "targetRole" as const, 
      label: "Target Role",
      render: (value: UserRole) => (
        <Badge className={`text-white ${getRoleColor(value)}`}>
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    { 
      key: "description" as const, 
      label: "Description",
      render: (value: string) => (
        <span className="text-muted-foreground max-w-xs truncate">{value}</span>
      )
    },
    { 
      key: "permissions" as const, 
      label: "Permissions",
      render: (value: string[]) => (
        <Badge variant="secondary">{value.length} permissions</Badge>
      )
    },
    { 
      key: "isDefault" as const, 
      label: "Type",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "Default" : "Custom"}
        </Badge>
      )
    },
    {
      key: "id" as const,
      label: "Actions",
      render: (_: any, row: PermissionGroup) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="Copy Group">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit Group">
            <Edit className="w-4 h-4" />
          </Button>
          {!row.isDefault && (
            <Button variant="ghost" size="sm" title="Delete Group">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Permission Groups</h1>
          <p className="text-muted-foreground">Create and manage permission templates for different roles</p>
        </div>
        {availableRoles.length > 0 && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Permission Group</DialogTitle>
                <DialogDescription>
                  Create a new permission group template that can be used when creating users.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="e.g., Admin Standard"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Role</Label>
                    <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.replace('_', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Describe what this permission group provides access to..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Permissions</Label>
                    <Badge variant="secondary">{selectedPermissions.length} selected</Badge>
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
                                checked={selectedPermissions.includes(permission.id)}
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
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup} disabled={!groupName || selectedPermissions.length === 0}>
                    Create Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPermissionGroups.length}</div>
            <p className="text-xs text-muted-foreground">Permission templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Groups</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPermissionGroups.filter(g => g.isDefault).length}
            </div>
            <p className="text-xs text-muted-foreground">System defaults</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPermissionGroups.filter(g => !g.isDefault).length}
            </div>
            <p className="text-xs text-muted-foreground">User created</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Groups</CardTitle>
          <CardDescription>
            Manage permission templates for streamlined user creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={mockPermissionGroups} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}