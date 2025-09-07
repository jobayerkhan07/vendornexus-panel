import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Lock, Unlock, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  actualBalance: number;
  lockedBalance: number;
  availableBalance: number;
  creditAllocated: number;
  className?: string;
  onTopUp?: () => void;
  onManageCredit?: () => void;
  showActions?: boolean;
}

export function BalanceCard({
  actualBalance,
  lockedBalance,
  availableBalance,
  creditAllocated,
  className,
  onTopUp,
  onManageCredit,
  showActions = true
}: BalanceCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="w-5 h-5 text-primary" />
          Balance Overview
        </CardTitle>
        <CardDescription>
          Your current balance and credit allocations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Balance Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-primary-light rounded-lg p-4 text-center">
            <div className={cn(
              "text-2xl font-bold",
              actualBalance >= 0 ? "text-success" : "text-danger"
            )}>
              ${actualBalance.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Actual Balance</div>
          </div>
          
          <div className="bg-warning-light rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              ${lockedBalance.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Locked Balance
            </div>
          </div>
          
          <div className="bg-success-light rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success">
              ${availableBalance.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Unlock className="w-3 h-3" />
              Available Balance
            </div>
          </div>
        </div>

        {/* Credit Information */}
        {creditAllocated > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Credit Allocated</div>
                <div className="text-sm text-muted-foreground">
                  Total credit given to users
                </div>
              </div>
              <Badge variant="outline" className="text-primary">
                ${creditAllocated.toFixed(2)}
              </Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {onTopUp && (
              <Button onClick={onTopUp} className="flex-1 gap-2">
                <TrendingUp className="w-4 h-4" />
                Top Up Balance
              </Button>
            )}
            {onManageCredit && (
              <Button onClick={onManageCredit} variant="outline" className="flex-1 gap-2">
                <TrendingDown className="w-4 h-4" />
                Manage Credit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}