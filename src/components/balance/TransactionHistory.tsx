import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { History, ArrowUpCircle, ArrowDownCircle, CreditCard, UserCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "topup" | "deduction" | "credit_allocated" | "credit_repaid" | "debt_repayment";
  amount: number;
  description: string;
  timestamp: string;
  relatedUser?: {
    id: string;
    name: string;
    email: string;
  };
  status: "completed" | "pending" | "failed";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  className?: string;
  onRefresh?: () => void;
}

export function TransactionHistory({ transactions, className, onRefresh }: TransactionHistoryProps) {
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "topup":
        return <ArrowUpCircle className="w-4 h-4 text-success" />;
      case "deduction":
        return <ArrowDownCircle className="w-4 h-4 text-danger" />;
      case "credit_allocated":
        return <UserCheck className="w-4 h-4 text-primary" />;
      case "credit_repaid":
        return <CreditCard className="w-4 h-4 text-success" />;
      case "debt_repayment":
        return <RefreshCw className="w-4 h-4 text-warning" />;
      default:
        return <History className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: Transaction["type"], amount: number) => {
    switch (type) {
      case "topup":
      case "credit_repaid":
        return "text-success";
      case "deduction":
      case "credit_allocated":
        return "text-danger";
      case "debt_repayment":
        return "text-warning";
      default:
        return amount >= 0 ? "text-success" : "text-danger";
    }
  };

  const getAmountDisplay = (type: Transaction["type"], amount: number) => {
    const sign = ["topup", "credit_repaid"].includes(type) ? "+" : "-";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  const getStatusBadgeVariant = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="w-5 h-5 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>
              Recent balance and credit transactions
            </CardDescription>
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <div className="text-muted-foreground">No transactions yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Transaction Icon */}
                <div className="flex-shrink-0">
                  {getTransactionIcon(transaction.type)}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Amount */}
                      <div className={cn(
                        "font-medium text-right",
                        getTransactionColor(transaction.type, transaction.amount)
                      )}>
                        {getAmountDisplay(transaction.type, transaction.amount)}
                      </div>
                      
                      {/* Status Badge */}
                      <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Related User */}
                  {transaction.relatedUser && (
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                          {getInitials(transaction.relatedUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm text-muted-foreground truncate">
                        {transaction.relatedUser.name}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}