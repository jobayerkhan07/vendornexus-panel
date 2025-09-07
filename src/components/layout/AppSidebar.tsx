import { useState } from "react";
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

// Mock user role - in real app this would come from auth context
const currentUserRole = "Admin"; // Super Admin, Admin, Reseller, User

const getMenuItems = (role: string) => {
  const baseItems = [];

  if (role === "Super Admin") {
    baseItems.push(
      { title: "Dashboard", url: "/", icon: BarChart3 },
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
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Profile", url: "/profile", icon: User },
      { title: "Settings", url: "/settings", icon: Settings }
    );
  } else if (role === "Admin") {
    baseItems.push(
      { title: "Dashboard", url: "/", icon: BarChart3 },
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
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Profile", url: "/profile", icon: User },
      { title: "Settings", url: "/settings", icon: Settings }
    );
  } else if (role === "Reseller") {
    baseItems.push(
      { title: "Dashboard", url: "/", icon: BarChart3 },
      { title: "Sell Price Groups", url: "/sell-price-groups", icon: DollarSign },
      { title: "Permission Groups", url: "/permission-groups", icon: UserX },
      { title: "Users", url: "/users", icon: Users },
      { title: "Balance Management", url: "/balance", icon: Wallet },
      { title: "Vendors", url: "/vendors", icon: Building2 },
      { title: "Number Pool", url: "/number-pool", icon: Phone },
      { title: "Vendor APIs", url: "/vendor-apis", icon: Globe },
      { title: "SMTP", url: "/smtp", icon: Mail },
      { title: "Campaigns", url: "/campaigns", icon: MessageSquare },
      { title: "SMS", url: "/sms", icon: MessageSquare },
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Profile", url: "/profile", icon: User },
      { title: "Settings", url: "/settings", icon: Settings }
    );
  } else { // User/Client
    baseItems.push(
      { title: "Dashboard", url: "/", icon: BarChart3 },
      { title: "Number Pool", url: "/number-pool", icon: Phone },
      { title: "Vendor APIs", url: "/vendor-apis", icon: Globe },
      { title: "SMS", url: "/sms", icon: MessageSquare },
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Profile", url: "/profile", icon: User },
      { title: "Settings", url: "/settings", icon: Settings }
    );
  }

  return baseItems;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = getMenuItems(currentUserRole);
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
        {/* Logo */}
        <div className="p-3 sm:p-4 border-b border-border">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-base sm:text-lg truncate">WebHook Panel</span>
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
                      {!collapsed && <span className="text-sm sm:text-base truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Role Badge */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm font-medium text-foreground">{currentUserRole}</div>
              <div className="text-xs text-muted-foreground">Current Role</div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}