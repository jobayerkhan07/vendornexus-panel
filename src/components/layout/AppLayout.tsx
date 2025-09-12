import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { ImpersonationBanner } from "@/components/layout/ImpersonationBanner";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, userProfile } = useAuth();

  const userMenuData = user && userProfile ? {
    email: userProfile.email,
    role: userProfile.role,
    display_name: userProfile.full_name,
    avatar_url: userProfile.avatar_url,
    balance: 0 // This will be fetched from balance hook when needed
  } : undefined;

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
                {userProfile && (
                  <div className="hidden lg:block text-sm text-muted-foreground">
                    Welcome back, <span className="font-medium text-foreground">{userProfile.full_name || userProfile.email}</span>
                  </div>
                )}
                <ThemeToggle />
                <UserMenu user={userMenuData} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 xl:p-10 bg-background overflow-auto max-w-[2000px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}