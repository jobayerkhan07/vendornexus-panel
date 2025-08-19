import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">Create and track marketing campaigns</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
        Campaign list placeholder
      </div>
    </div>
  );
}
