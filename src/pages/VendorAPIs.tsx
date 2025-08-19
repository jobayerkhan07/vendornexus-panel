import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function VendorAPIs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor APIs</h1>
          <p className="text-muted-foreground">Manage API credentials for vendors</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add API
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
        Vendor API list placeholder
      </div>
    </div>
  );
}
