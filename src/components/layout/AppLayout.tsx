import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { ImpersonationBanner } from "@/components/layout/ImpersonationBanner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          email: user.email || "",
          role: "admin", // This would come from your profiles table
          display_name: user.user_metadata?.display_name,
          avatar_url: user.user_metadata?.avatar_url
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email || "",
          role: "admin", // This would come from your profiles table
          display_name: session.user.user_metadata?.display_name,
          avatar_url: session.user.user_metadata?.avatar_url
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <ImpersonationBanner />
          {/* Header */}
          <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-foreground hidden sm:block">WebHook Panel</h1>
              <h1 className="text-lg font-semibold text-foreground sm:hidden">WHP</h1>
              <div className="flex items-center gap-2 sm:gap-4">
                {user && (
                  <div className="hidden md:block text-sm text-muted-foreground">
                    Welcome back, <span className="font-medium text-foreground">{user.display_name || "User"}</span>
                  </div>
                )}
                <ThemeToggle />
                <UserMenu user={user} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}