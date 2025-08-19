import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SMTP() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SMTP</h1>
          <p className="text-muted-foreground">Manage SMTP configurations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add SMTP
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 text-muted-foreground">
        SMTP configuration list placeholder
      </div>
    </div>
  );
}
