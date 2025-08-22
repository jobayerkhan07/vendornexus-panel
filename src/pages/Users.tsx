import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react";

// Mock data
const mockUsers = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "User",
    status: "active",
    balance: 150.75,
    lastActive: "2024-01-15",
    smsCount: 245,
    priceGroup: "Standard"
  },
  {
    id: "2",
    email: "jane.smith@example.com", 
    name: "Jane Smith",
    role: "Reseller",
    status: "active",
    balance: 2450.00,
    lastActive: "2024-01-14",
    smsCount: 1024,
    priceGroup: "Premium"
  },
  {
    id: "3",
    email: "mike.johnson@example.com",
    name: "Mike Johnson", 
    role: "User",
    status: "suspended",
    balance: -25.50,
    lastActive: "2024-01-10",
    smsCount: 89,
    priceGroup: "Basic"
  },
  {
    id: "4",
    email: "sarah.wilson@example.com",
    name: "Sarah Wilson",
    role: "User", 
    status: "active",
    balance: 89.25,
    lastActive: "2024-01-15",
    smsCount: 156,
    priceGroup: "Standard"
  }
];

const userColumns = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { 
    key: "role" as const, 
    label: "Role",
    render: (value: string) => (
      <Badge variant={value === "Admin" ? "default" : value === "Reseller" ? "secondary" : "outline"}>
        {value}
      </Badge>
    )
  },
  {
    key: "status" as const,
    label: "Status", 
    render: (value: string) => (
      <span className={`status-badge ${
        value === "active" ? "status-active" : 
        value === "suspended" ? "status-inactive" : "status-pending"
      }`}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    )
  },
  {
    key: "balance" as const,
    label: "Balance",
    render: (value: number) => (
      <span className={`font-medium ${value < 0 ? "text-danger" : "text-foreground"}`}>
        ${value.toFixed(2)}
      </span>
    )
  },
  { key: "smsCount" as const, label: "SMS Count" },
  { key: "priceGroup" as const, label: "Price Group" },
  { key: "lastActive" as const, label: "Last Active" },
  {
    key: "actions" as const,
    label: "Actions",
    render: (_, row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <DollarSign className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">1,247</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-success">1,198</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-warning">43</div>
          <div className="text-sm text-muted-foreground">Suspended</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-primary">156</div>
          <div className="text-sm text-muted-foreground">Resellers</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        data={filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
        columns={userColumns}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
}