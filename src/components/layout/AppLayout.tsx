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
    // For demo purposes, set a mock user to simulate being logged in
    // In real app, this would come from Supabase auth
    const mockUser = {
      email: "admin@example.com",
      role: "admin" as const,
      display_name: "Admin User",
      avatar_url: undefined
    };
    setUser(mockUser);

    // Commented out real auth for demo
    // supabase.auth.getUser().then(({ data: { user } }) => {
    //   if (user) {
    //     setUser({
    //       email: user.email || "",
    //       role: "admin",
    //       display_name: user.user_metadata?.display_name,
    //       avatar_url: user.user_metadata?.avatar_url
    //     });
    //   }
    // });

    // const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    //   if (session?.user) {
    //     setUser({
    //       email: session.user.email || "",
    //       role: "admin",
    //       display_name: session.user.user_metadata?.display_name,
    //       avatar_url: session.user.user_metadata?.avatar_url
    //     });
    //   } else {
    //     setUser(null);
    //   }
    // });

    // return () => subscription.unsubscribe();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <ImpersonationBanner />
          {/* Header */}
          <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center px-3 sm:px-4 lg:px-6 shadow-sm">
            <SidebarTrigger className="mr-2 sm:mr-4" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground hidden xs:block">SMS Reseller Portal</h1>
              <h1 className="text-base font-semibold text-foreground xs:hidden">SRP</h1>
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                {user && (
                  <div className="hidden lg:block text-sm text-muted-foreground">
                    Welcome back, <span className="font-medium text-foreground">{user.display_name || "User"}</span>
                  </div>
                )}
                <ThemeToggle />
                <UserMenu user={user} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}