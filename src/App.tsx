import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Lazy load page components
const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const GoalCreation = lazy(() => import('./pages/GoalCreation'));
const GoalApproval = lazy(() => import('./pages/GoalApproval'));
const Analytics = lazy(() => import('./pages/Analytics'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen font-black text-blue-700 animate-pulse uppercase tracking-[0.3em] text-xs">
    Initialing Core Systems...
  </div>
);

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" />;
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/" />;

  return <>{children}</>;
}

function RoleHome() {
  const { user, profile, loading } = useAuth();
  
  if (loading || (user && !profile)) {
    return <LoadingFallback />;
  }
  
  if (!profile) return <Navigate to="/login" />;
  
  switch (profile.role) {
    case 'admin': return <Navigate to="/admin" />;
    case 'manager': return <Navigate to="/manager" />;
    default: return <Navigate to="/employee" />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<RoleHome />} />
              
              {/* Employee Routes */}
              <Route path="employee" element={<PrivateRoute roles={['employee', 'manager', 'admin']}><EmployeeDashboard /></PrivateRoute>} />
              <Route path="goals/new" element={<PrivateRoute roles={['employee', 'manager', 'admin']}><GoalCreation /></PrivateRoute>} />
              
              {/* Manager Routes */}
              <Route path="manager" element={<PrivateRoute roles={['manager', 'admin']}><ManagerDashboard /></PrivateRoute>} />
              <Route path="manager/approvals" element={<PrivateRoute roles={['manager', 'admin']}><GoalApproval /></PrivateRoute>} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
              
              {/* Analytics */}
              <Route path="analytics" element={<PrivateRoute roles={['admin', 'manager']}><Analytics /></PrivateRoute>} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
