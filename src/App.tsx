import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import NumberPool from "./pages/NumberPool";
import SMS from "./pages/SMS";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import UserRoles from "./pages/UserRoles";
import SellPriceGroups from "./pages/SellPriceGroups";
import PermissionGroups from "./pages/PermissionGroups";
import CreateUser from "./pages/CreateUser";
import BalanceManagement from "./pages/BalanceManagement";
import UserPermissions from "./pages/UserPermissions";
import SystemPermissions from "./pages/SystemPermissions";
import VendorAPIs from "./pages/VendorAPIs";
import PaymentGateway from "./pages/PaymentGateway";
import SMTP from "./pages/SMTP";
import Campaigns from "./pages/Campaigns";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ImpersonationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/profile" element={
              <AppLayout>
                <Profile />
              </AppLayout>
            } />
            <Route path="/settings" element={
              <AppLayout>
                <Settings />
              </AppLayout>
            } />
            <Route path="/user-roles" element={
              <AppLayout>
                <UserRoles />
              </AppLayout>
            } />
            <Route path="/permission-groups" element={
              <AppLayout>
                <PermissionGroups />
              </AppLayout>
            } />
            <Route path="/user-permissions" element={
              <AppLayout>
                <UserPermissions />
              </AppLayout>
            } />
            <Route path="/system-permissions" element={
              <AppLayout>
                <SystemPermissions />
              </AppLayout>
            } />
            <Route path="/users/create" element={
              <AppLayout>
                <CreateUser />
              </AppLayout>
            } />
            <Route path="/balance" element={
              <AppLayout>
                <BalanceManagement />
              </AppLayout>
            } />
            <Route path="/sell-price-groups" element={
              <AppLayout>
                <SellPriceGroups />
              </AppLayout>
            } />
            <Route path="/users" element={
              <AppLayout>
                <Users />
              </AppLayout>
            } />
            <Route path="/vendors" element={
              <AppLayout>
                <Vendors />
              </AppLayout>
            } />
            <Route path="/number-pool" element={
              <AppLayout>
                <NumberPool />
              </AppLayout>
            } />
            <Route path="/vendor-apis" element={
              <AppLayout>
                <VendorAPIs />
              </AppLayout>
            } />
            <Route path="/payments" element={
              <AppLayout>
                <PaymentGateway />
              </AppLayout>
            } />
            <Route path="/smtp" element={
              <AppLayout>
                <SMTP />
              </AppLayout>
            } />
            <Route path="/campaigns" element={
              <AppLayout>
                <Campaigns />
              </AppLayout>
            } />
            <Route path="/sms" element={
              <AppLayout>
                <SMS />
              </AppLayout>
            } />
            <Route path="/reports" element={
              <AppLayout>
                <Reports />
              </AppLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ImpersonationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;