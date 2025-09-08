import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
      <AuthProvider>
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
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/user-roles" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AppLayout>
                    <UserRoles />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/permission-groups" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AppLayout>
                    <PermissionGroups />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/user-permissions" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AppLayout>
                    <UserPermissions />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/system-permissions" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AppLayout>
                    <SystemPermissions />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/users/create" element={
                <ProtectedRoute requiredRole={['admin', 'reseller']}>
                  <AppLayout>
                    <CreateUser />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/balance" element={
                <ProtectedRoute>
                  <AppLayout>
                    <BalanceManagement />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/sell-price-groups" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AppLayout>
                    <SellPriceGroups />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requiredRole={['admin', 'reseller']}>
                  <AppLayout>
                    <Users />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/vendors" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AppLayout>
                    <Vendors />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/number-pool" element={
                <ProtectedRoute>
                  <AppLayout>
                    <NumberPool />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/vendor-apis" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AppLayout>
                    <VendorAPIs />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/payments" element={
                <ProtectedRoute>
                  <AppLayout>
                    <PaymentGateway />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/smtp" element={
                <ProtectedRoute>
                  <AppLayout>
                    <SMTP />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/campaigns" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Campaigns />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/sms" element={
                <ProtectedRoute>
                  <AppLayout>
                    <SMS />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Reports />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ImpersonationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;