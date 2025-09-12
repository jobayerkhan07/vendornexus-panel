import { NavLink, useLocation } from "react-router-dom";
import {
  Users, UserCog, DollarSign, Building2, Phone, 
  Settings, Mail, MessageSquare, BarChart3, 
  Shield, CreditCard, Zap, Database, Globe, User,
  Key, UserX, Wallet
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

const getMenuItems = (role: string, hasPermission: (permission: string) => boolean) => {
  const baseItems = [];

  // Dashboard - always available
  baseItems.push({ title: "Dashboard", url: "/", icon: BarChart3 });

  if (role === "super_admin") {
    // Super admin has access to everything
    baseItems.push(
      { title: "User Roles", url: "/user-roles", icon: Shield },
      { title: "Permission Groups", url: "/permission-groups", icon: UserX },
      { title: "User Permissions", url: "/user-permissions", icon: Key },
      { title: "System Permissions", url: "/system-permissions", icon: Database },
      { title: "Users", url: "/users", icon: Users },
      { title: "Create User", url: "/users/create", icon: UserCog },
      { title: "Balance Management", url: "/balance", icon: Wallet },
      { title: "Sell Price Groups", url: "/sell-price-groups", icon: DollarSign },
      { title: "Vendors", url: "/vendors", icon: Building2 },
      { title: "Number Pool", url: "/number-pool", icon: Phone },
      { title: "Vendor APIs", url: "/vendor-apis", icon: Globe },
      { title: "Payment Gateway", url: "/payments", icon: CreditCard },
      { title: "SMTP", url: "/smtp", icon: Mail },
      { title: "Campaigns", url: "/campaigns", icon: MessageSquare },
      { title: "SMS", url: "/sms", icon: MessageSquare },
      { title: "Reports", url: "/reports", icon: BarChart3 }
    );
  } else {
    // Permission-based menu items for other roles
    if (hasPermission('role_management')) {
      baseItems.push({ title: "User Roles", url: "/user-roles", icon: Shield });
    }
    
    if (hasPermission('permission_management')) {
      baseItems.push(
        { title: "Permission Groups", url: "/permission-groups", icon: UserX },
        { title: "User Permissions", url: "/user-permissions", icon: Key },
        { title: "System Permissions", url: "/system-permissions", icon: Database }
      );
    }
    
    if (hasPermission('user_management')) {
      baseItems.push(
        { title: "Users", url: "/users", icon: Users },
        { title: "Create User", url: "/users/create", icon: UserCog }
      );
    }
    
    if (hasPermission('balance_management')) {
      baseItems.push({ title: "Balance Management", url: "/balance", icon: Wallet });
    }
    
    if (hasPermission('pricing_management')) {
      baseItems.push({ title: "Sell Price Groups", url: "/sell-price-groups", icon: DollarSign });
    }
    
    if (hasPermission('vendor_management')) {
      baseItems.push(
        { title: "Vendors", url: "/vendors", icon: Building2 },
        { title: "Vendor APIs", url: "/vendor-apis", icon: Globe }
      );
    }
    
    if (hasPermission('number_management')) {
      baseItems.push({ title: "Number Pool", url: "/number-pool", icon: Phone });
    }
    
    if (hasPermission('payment_management')) {
      baseItems.push({ title: "Payment Gateway", url: "/payments", icon: CreditCard });
    }
    
    if (hasPermission('smtp_management')) {
      baseItems.push({ title: "SMTP", url: "/smtp", icon: Mail });
    }
    
    if (hasPermission('campaign_management')) {
      baseItems.push({ title: "Campaigns", url: "/campaigns", icon: MessageSquare });
    }
    
    if (hasPermission('sms_management')) {
      baseItems.push({ title: "SMS", url: "/sms", icon: MessageSquare });
    }
    
    if (hasPermission('reporting')) {
      baseItems.push({ title: "Reports", url: "/reports", icon: BarChart3 });
    }
  }

  // Always available
  baseItems.push(
    { title: "Profile", url: "/profile", icon: User },
    { title: "Settings", url: "/settings", icon: Settings }
  );

  return baseItems;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { userProfile } = useAuth();
  const { hasPermission } = usePermissions();
  
  const menuItems = getMenuItems(userProfile?.role || 'user', hasPermission);
  const collapsed = state === "collapsed";
  
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClasses = (path: string) => {
    const base = "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    return isActive(path) 
      ? `${base} bg-primary text-primary-foreground` 
      : `${base} text-muted-foreground hover:text-foreground hover:bg-muted`;
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        <ScrollArea className="h-full">
          {/* Logo */}
          <div className="p-3 sm:p-4 border-b border-border">
            {!collapsed ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-base sm:text-lg whitespace-nowrap overflow-hidden text-ellipsis">WebHook Panel</span>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 p-1 sm:p-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClasses(item.url)}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* User Role Badge */}
          {!collapsed && userProfile && (
            <div className="mt-auto p-4 border-t border-border">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {userProfile.full_name || userProfile.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  {userProfile.role.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}