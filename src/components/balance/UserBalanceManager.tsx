import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Search, DollarSign, UserPlus, TrendingDown } from "lucide-react";
import { CreditAllocationDialog } from "./CreditAllocationDialog";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  currentBalance: number;
  creditLimit: number;
  lastActive: string;
  status: "active" | "suspended" | "inactive";
  actions?: any; // Add this for the actions column
}

interface UserBalanceManagerProps {
  users: User[];
  creatorAvailableBalance: number;
  onAllocateCredit?: (userId: string, amount: number) => void;
  className?: string;
}

export function UserBalanceManager({
  users,
  creatorAvailableBalance,
  onAllocateCredit,
  className
}: UserBalanceManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleAllocateCredit = (user: User) => {
    setSelectedUser(user);
    setShowCreditDialog(true);
  };

  const handleCreditAllocation = (userId: string, amount: number) => {
    onAllocateCredit?.(userId, amount);
    // Update local state or refresh data
  };

  const ActionButtons = ({ row }: { row: User }) => {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAllocateCredit(row)}
          className="h-8 w-8 p-0"
          disabled={creatorAvailableBalance <= 0}
        >
          <TrendingDown className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const userColumns = [
    {
      key: "name" as const,
      label: "User",
      render: (_, row: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate">{row.name}</div>
            <div className="text-sm text-muted-foreground truncate">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "currentBalance" as const,
      label: "Current Balance",
      render: (value: number) => (
        <span className={`font-medium ${value >= 0 ? "text-success" : "text-danger"}`}>
          ${value.toFixed(2)}
        </span>
      )
    },
    {
      key: "creditLimit" as const,
      label: "Credit Limit",
      render: (value: number) => (
        <span className="font-medium text-warning">
          {value > 0 ? `$${value.toFixed(2)}` : "None"}
        </span>
      )
    },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => (
        <Badge variant={
          value === "active" ? "default" : 
          value === "suspended" ? "destructive" : "secondary"
        }>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: "lastActive" as const,
      label: "Last Active"
    },
    {
      key: "actions" as const,
      label: "Actions",
      render: (_, row: User) => <ActionButtons row={row} />
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Manage User Credits
              </CardTitle>
              <CardDescription>
                Allocate credit to your users based on your available balance
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-success">
              Available: ${creatorAvailableBalance.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users Table */}
          <DataTable
            data={filteredUsers}
            columns={userColumns}
          />
        </CardContent>
      </Card>

      {/* Credit Allocation Dialog */}
      <CreditAllocationDialog
        open={showCreditDialog}
        onOpenChange={setShowCreditDialog}
        user={selectedUser}
        creatorAvailableBalance={creatorAvailableBalance}
        onAllocateCredit={handleCreditAllocation}
      />
    </div>
  );
}