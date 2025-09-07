import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, AlertTriangle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  currentBalance: number;
  creditLimit: number;
}

interface CreditAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  creatorAvailableBalance: number;
  onAllocateCredit?: (userId: string, amount: number) => void;
}

export function CreditAllocationDialog({
  open,
  onOpenChange,
  user,
  creatorAvailableBalance,
  onAllocateCredit
}: CreditAllocationDialogProps) {
  const [creditAmount, setCreditAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAllocate = async () => {
    if (!user || !creditAmount) return;

    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive"
      });
      return;
    }

    if (amount > creatorAvailableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough available balance to allocate this credit",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      onAllocateCredit?.(user.id, amount);
      toast({
        title: "Credit Allocated",
        description: `Successfully allocated $${amount.toFixed(2)} credit to ${user.name}`
      });
      setCreditAmount("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Allocation Failed",
        description: "Failed to allocate credit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Allocate Credit
          </DialogTitle>
          <DialogDescription>
            Allocate credit limit to allow user to spend beyond their current balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground truncate">{user.name}</div>
              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
            </div>
            <Badge variant={user.currentBalance >= 0 ? "default" : "destructive"}>
              ${user.currentBalance.toFixed(2)}
            </Badge>
          </div>

          {/* Current Credit Limit */}
          {user.creditLimit > 0 && (
            <div className="bg-warning-light p-3 rounded-lg">
              <div className="text-sm text-warning-foreground">
                Current Credit Limit: <span className="font-medium">${user.creditLimit.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Credit Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="creditAmount">Credit Amount ($)</Label>
            <Input
              id="creditAmount"
              type="number"
              step="0.01"
              min="0"
              max={creatorAvailableBalance}
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              placeholder="0.00"
            />
            <div className="text-sm text-muted-foreground">
              Your available balance: <span className="font-medium text-success">${creatorAvailableBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Funds will be locked from your account as the user spends beyond their balance.
            </AlertDescription>
          </Alert>

          {/* Impact Preview */}
          {creditAmount && !isNaN(parseFloat(creditAmount)) && (
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <div className="text-sm font-medium text-foreground">Preview:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>User balance:</div>
                <div className="text-success font-medium">
                  ${user.currentBalance.toFixed(2)} (unchanged)
                </div>
                <div>User credit limit:</div>
                <div className="text-primary font-medium">
                  ${(user.creditLimit + parseFloat(creditAmount)).toFixed(2)}
                </div>
                <div>User spending power:</div>
                <div className="text-info font-medium">
                  ${(user.currentBalance + parseFloat(creditAmount)).toFixed(2)}
                </div>
                <div>Your available balance:</div>
                <div className="text-success font-medium">
                  ${(creatorAvailableBalance - parseFloat(creditAmount)).toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAllocate} disabled={isLoading || !creditAmount}>
            {isLoading ? "Allocating..." : "Allocate Credit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}