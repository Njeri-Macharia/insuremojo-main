import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import { UserProvider } from "./contexts/UserContext";
import { useUser } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";
// import UserDashboard from "./pages/user/UserDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import PoliciesPage from "./pages/admin/PoliciesPage";
import PolicyDetail from "./pages/admin/PolicyDetail";
import ClaimsPage from "./pages/admin/ClaimsPage";
import ClaimDetail from "./pages/admin/ClaimDetail";
import CustomersPage from "./pages/admin/CustomersPage";
import CustomerDetail from "./pages/admin/CustomerDetail";
// import PaymentsPage from "./pages/admin/PaymentsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import SupportPage from "./pages/admin/SupportPage";
import ReportsPage from './pages/admin/ReportsPage';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route Component - Only allows admin/staff roles
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !['admin', 'underwriter', 'support', 'manager'].includes(user.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              {/* <Route path="/" element={<Index />} /> */}
              <Route path="/" element={<Login />} />
              
              {/* User Dashboard - Protected */}
              {/* <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } /> */}
              
              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/policies" element={
                <AdminRoute>
                  <PoliciesPage />
                </AdminRoute>
              } />
              <Route path="/admin/policies/:id" element={
                <AdminRoute>
                  <PolicyDetail />
                </AdminRoute>
              } />
              <Route path="/admin/claims" element={
                <AdminRoute>
                  <ClaimsPage />
                </AdminRoute>
              } />
              <Route path="/admin/claims/:id" element={
                <AdminRoute>
                  <ClaimDetail />
                </AdminRoute>
              } />
              <Route path="/admin/customers" element={
                <AdminRoute>
                  <CustomersPage />
                </AdminRoute>
              } />
              <Route path="/admin/customers/:id" element={
                <AdminRoute>
                  <CustomerDetail />
                </AdminRoute>
              } />
              {/* <Route path="/admin/payments" element={
                <AdminRoute>
                  <PaymentsPage />
                </AdminRoute>
              } /> */}
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <SettingsPage />
                </AdminRoute>
              } />
              <Route path="/admin/support" element={
                <AdminRoute>
                  <SupportPage />
                </AdminRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminRoute>
                  <ReportsPage />
                </AdminRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
