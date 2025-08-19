import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PaymentGateway() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Gateway</h1>
          <p className="text-muted-foreground">Configure payment gateway integrations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Gateway
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
        Payment gateway list placeholder
      </div>
    </div>
  );
}
