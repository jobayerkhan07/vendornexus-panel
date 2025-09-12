import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit, Trash2, DollarSign, UserCheck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { startImpersonation } = useImpersonation();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const { users, stats, loading, refresh } = useUsers();
  const { canImpersonate } = usePermissions();

  const handleImpersonate = async (targetUser: any) => {
    if (!user || !userProfile) return;
    
    const canImpersonateUser = await canImpersonate(targetUser.id);
    if (!canImpersonateUser) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to impersonate this user",
        variant: "destructive"
      });
      return;
    }
    
    const currentUser = {
      id: user.id,
      email: userProfile.email,
      role: userProfile.role
    };
    
    startImpersonation(currentUser, targetUser);
    toast({
      title: "Impersonation started",
      description: `You are now impersonating ${targetUser.email}`,
    });
  };

  const handleEdit = (user: any) => {
    toast({
      title: "Edit User",
      description: `Edit functionality for ${user.email} would open here`,
    });
  };

  const handleManageBalance = (user: any) => {
    // Navigate to balance management page or open balance dialog
    console.log("Managing balance for:", user);
    toast({
      title: "Balance Management",
      description: `Opening balance management for ${user.email}`,
    });
  };

  const handleDelete = (user: any) => {
    toast({
      title: "Delete User",
      description: `Delete confirmation for ${user.email} would appear here`,
      variant: "destructive"
    });
  };

  const ActionButtons = ({ row }: { row: any }) => {
    return (
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleEdit(row)}
          className="h-8 w-8 p-0"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleManageBalance(row)}
          className="h-8 w-8 p-0"
        >
          <DollarSign className="w-4 h-4" />
        </Button>
        {/* Only show impersonate if user has permission */}
        {(userProfile?.role === 'super_admin' || row.created_by === user?.id) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleImpersonate(row)}
            className="h-8 w-8 p-0 text-primary hover:text-primary"
          >
            <UserCheck className="w-4 h-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleDelete(row)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const userColumns = [
    { 
      key: "full_name" as const, 
      label: "Name",
      render: (value: string | null) => value || "N/A"
    },
    { key: "email" as const, label: "Email" },
    { 
      key: "role" as const, 
      label: "Role",
      render: (value: string) => (
        <Badge variant={
          value === "super_admin" ? "default" : 
          value === "admin" ? "secondary" : 
          value === "reseller" ? "outline" : "outline"
        }>
          {value.replace('_', ' ').toUpperCase()}
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
          ${value?.toFixed(2) || '0.00'}
        </span>
      )
    },
    { key: "smsCount" as const, label: "SMS Count" },
    { 
      key: "last_login" as const, 
      label: "Last Login",
      render: (value: string | null) => {
        if (!value) return "Never";
        return new Date(value).toLocaleDateString();
      }
    },
    {
      key: "actions" as const,
      label: "Actions",
      render: (_, row: any) => (
        <ActionButtons row={row} />
      )
    }
  ];

  const filteredUsers = users.filter(user =>
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage user accounts and permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/balance" className="w-full sm:w-auto">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Wallet className="w-4 h-4" />
              Balance Management
            </Button>
          </Link>
          <Link to="/users/create" className="w-full sm:w-auto">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-success">{stats.active}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Active Users</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-warning">{stats.suspended}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Suspended</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-primary">{stats.resellers}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Resellers</div>
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
      <div className="overflow-x-auto">
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
    </div>
  );
}