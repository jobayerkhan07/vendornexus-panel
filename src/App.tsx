import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import NumberPool from "./pages/NumberPool";
import SMS from "./pages/SMS";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import UserRoles from "./pages/UserRoles";
import SellPriceGroups from "./pages/SellPriceGroups";
import VendorAPIs from "./pages/VendorAPIs";
import PaymentGateway from "./pages/PaymentGateway";
import SMTP from "./pages/SMTP";
import Campaigns from "./pages/Campaigns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-roles" element={<UserRoles />} />
            <Route path="/sell-price-groups" element={<SellPriceGroups />} />
            <Route path="/users" element={<Users />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/number-pool" element={<NumberPool />} />
            <Route path="/vendor-apis" element={<VendorAPIs />} />
            <Route path="/payments" element={<PaymentGateway />} />
            <Route path="/smtp" element={<SMTP />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/sms" element={<SMS />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;