import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Shield } from "lucide-react";

const mockRoles = [
  { id: 1, name: "Admin", description: "Full system access", permissions: "All", users: 2, status: "Active" },
  { id: 2, name: "Reseller", description: "Manage users and sell services", permissions: "Limited", users: 15, status: "Active" },
  { id: 3, name: "User", description: "Basic access to services", permissions: "Basic", users: 234, status: "Active" },
];

const columns = [
  { key: "name" as const, label: "Role Name" },
  { 
    key: "description" as const, 
    label: "Description",
    render: (value: string) => (
      <span className="text-muted-foreground">{value}</span>
    )
  },
  { 
    key: "permissions" as const, 
    label: "Permissions",
    render: (value: string) => (
      <Badge variant={value === "All" ? "default" : value === "Limited" ? "secondary" : "outline"}>
        {value}
      </Badge>
    )
  },
  { key: "users" as const, label: "Users" },
  { 
    key: "status" as const, 
    label: "Status",
    render: (value: string) => (
      <Badge variant={value === "Active" ? "default" : "destructive"}>
        {value}
      </Badge>
    )
  },
  {
    key: "id" as const,
    label: "Actions",
    render: (_: any, row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

export default function UserRoles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Roles</h1>
          <p className="text-muted-foreground">Manage system roles and permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">System defined roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">251</div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Total permissions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Configure user roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={mockRoles} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}