import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { useToast } from "@/hooks/use-toast";

export function ImpersonationBanner() {
  const { state, endImpersonation } = useImpersonation();
  const { toast } = useToast();

  if (!state.isImpersonating || !state.originalUser || !state.impersonatedUser) {
    return null;
  }

  const handleReturnToOriginal = () => {
    endImpersonation();
    toast({
      title: "Returned to original account",
      description: `You are now logged in as ${state.originalUser?.email}`,
    });
  };

  return (
    <div className="bg-warning/10 border-b border-warning/20 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground">
              Impersonating: <strong>{state.impersonatedUser.email}</strong>
            </span>
            <span className="text-muted-foreground">
              (Original: {state.originalUser.email})
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReturnToOriginal}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to My Account
        </Button>
      </div>
    </div>
  );
}