import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CreditCard, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  debtAmount: number;
  onTopUp?: (amount: number) => void;
}

export function TopUpDialog({
  open,
  onOpenChange,
  currentBalance,
  debtAmount,
  onTopUp
}: TopUpDialogProps) {
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTopUp = async () => {
    if (!topUpAmount) return;

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      onTopUp?.(amount);
      toast({
        title: "Top-up Successful",
        description: `Successfully added $${amount.toFixed(2)} to your account`
      });
      setTopUpAmount("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Top-up Failed",
        description: "Failed to process top-up. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const amount = parseFloat(topUpAmount) || 0;
  const debtRepayment = Math.min(amount, debtAmount);
  const remainingAmount = Math.max(0, amount - debtAmount);
  const newBalance = currentBalance + remainingAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Top Up Balance
          </DialogTitle>
          <DialogDescription>
            Add funds to your account. Credit debt will be automatically repaid to your creator first.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Balance:</span>
              <span className={`font-medium ${currentBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                ${currentBalance.toFixed(2)}
              </span>
            </div>
            {debtAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Credit Debt to Creator:</span>
                <span className="font-medium text-danger">${debtAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Top-up Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="topUpAmount">Top-up Amount ($)</Label>
            <Input
              id="topUpAmount"
              type="number"
              step="0.01"
              min="0"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Repayment Breakdown */}
          {amount > 0 && debtAmount > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Payment Breakdown:</div>
              
              {/* Credit Debt Repayment */}
              <div className="bg-danger-light p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Repay Credit to Creator:</span>
                  <span className="font-medium text-danger">${debtRepayment.toFixed(2)}</span>
                </div>
                {debtRepayment < debtAmount && (
                  <Progress 
                    value={(debtRepayment / debtAmount) * 100} 
                    className="mt-2 h-2"
                  />
                )}
              </div>

              {/* Remaining Amount */}
              {remainingAmount > 0 && (
                <div className="bg-success-light p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Added to Balance:</span>
                    <span className="font-medium text-success">${remainingAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Final Balance */}
              <div className="bg-primary-light p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Balance:</span>
                  <span className="font-bold text-primary">${newBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Simple Balance Preview for no debt */}
          {amount > 0 && debtAmount === 0 && (
            <div className="bg-success-light p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">New Balance:</span>
                <span className="font-medium text-success">${newBalance.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Info Alert */}
          {debtAmount > 0 && (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Your credit debt will be automatically repaid to your creator when you top up.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleTopUp} disabled={isLoading || !topUpAmount}>
            {isLoading ? "Processing..." : `Top Up $${amount.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}