import { useState } from "react";
import { BalanceCard } from "@/components/balance/BalanceCard";
import { UserBalanceManager } from "@/components/balance/UserBalanceManager";
import { TransactionHistory } from "@/components/balance/TransactionHistory";
import { TopUpDialog } from "@/components/balance/TopUpDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from API/database
const mockCurrentUser = {
  actualBalance: 1250.75,
  lockedBalance: 450.00,
  availableBalance: 800.75,
  creditAllocated: 450.00,
  debtAmount: 0
};

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    currentBalance: -25.50,
    creditLimit: 50.00,
    lastActive: "2024-01-15",
    status: "active" as const
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    currentBalance: 15.75,
    creditLimit: 0,
    lastActive: "2024-01-14",
    status: "active" as const
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    currentBalance: -100.00,
    creditLimit: 150.00,
    lastActive: "2024-01-13",
    status: "suspended" as const
  }
];

const mockTransactions = [
  {
    id: "1",
    type: "topup" as const,
    amount: 500.00,
    description: "Account top-up via credit card",
    timestamp: "2024-01-15T10:30:00Z",
    status: "completed" as const
  },
  {
    id: "2",
    type: "credit_allocated" as const,
    amount: 150.00,
    description: "Credit allocated to Mike Johnson",
    timestamp: "2024-01-14T15:45:00Z",
    relatedUser: {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com"
    },
    status: "completed" as const
  },
  {
    id: "3",
    type: "credit_repaid" as const,
    amount: 25.00,
    description: "Credit repayment from John Doe",
    timestamp: "2024-01-13T09:15:00Z",
    relatedUser: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com"
    },
    status: "completed" as const
  },
  {
    id: "4",
    type: "deduction" as const,
    amount: 75.25,
    description: "SMS service usage charges",
    timestamp: "2024-01-12T14:20:00Z",
    status: "completed" as const
  }
];

export default function BalanceManagement() {
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [users, setUsers] = useState(mockUsers);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const { toast } = useToast();

  const handleTopUp = (amount: number) => {
    const newBalance = currentUser.actualBalance + amount;
    const debtRepayment = Math.min(amount, currentUser.debtAmount);
    
    setCurrentUser(prev => ({
      ...prev,
      actualBalance: newBalance,
      availableBalance: prev.availableBalance + amount,
      debtAmount: Math.max(0, prev.debtAmount - amount)
    }));

    // Add transaction record
    const newTransaction = {
      id: Date.now().toString(),
      type: "topup" as const,
      amount: amount,
      description: `Account top-up via payment gateway`,
      timestamp: new Date().toISOString(),
      status: "completed" as const
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleAllocateCredit = (userId: string, amount: number) => {
    // Update user balance
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            currentBalance: user.currentBalance - amount,
            creditLimit: user.creditLimit + amount
          }
        : user
    ));

    // Update creator balance
    setCurrentUser(prev => ({
      ...prev,
      lockedBalance: prev.lockedBalance + amount,
      availableBalance: prev.availableBalance - amount,
      creditAllocated: prev.creditAllocated + amount
    }));

    // Add transaction record
    const user = users.find(u => u.id === userId);
    const newTransaction = {
      id: Date.now().toString(),
      type: "credit_allocated" as const,
      amount: amount,
      description: `Credit allocated to ${user?.name}`,
      timestamp: new Date().toISOString(),
      relatedUser: user ? {
        id: user.id,
        name: user.name,
        email: user.email
      } : undefined,
      status: "completed" as const
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleRefreshTransactions = () => {
    toast({
      title: "Refreshed",
      description: "Transaction history has been refreshed"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Link to="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Balance Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your balance and allocate credit to users
          </p>
        </div>
      </div>

      {/* Balance Overview */}
      <BalanceCard
        actualBalance={currentUser.actualBalance}
        lockedBalance={currentUser.lockedBalance}
        availableBalance={currentUser.availableBalance}
        creditAllocated={currentUser.creditAllocated}
        onTopUp={() => setShowTopUpDialog(true)}
        onManageCredit={() => {
          const element = document.getElementById('user-management');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* User Balance Management */}
      <div id="user-management">
        <UserBalanceManager
          users={users}
          creatorAvailableBalance={currentUser.availableBalance}
          onAllocateCredit={handleAllocateCredit}
        />
      </div>

      {/* Transaction History */}
      <TransactionHistory
        transactions={transactions}
        onRefresh={handleRefreshTransactions}
      />

      {/* Top-up Dialog */}
      <TopUpDialog
        open={showTopUpDialog}
        onOpenChange={setShowTopUpDialog}
        currentBalance={currentUser.actualBalance}
        debtAmount={currentUser.debtAmount}
        onTopUp={handleTopUp}
      />
    </div>
  );
}