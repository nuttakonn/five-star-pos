import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import SalesHistory from "./pages/SalesHistory"
import Login from "./pages/Login"
import ChangePassword from "./pages/ChangePassword"
import Stock from "./pages/Stock"
import UserManagement from "./pages/UserManagement"

const queryClient = new QueryClient()

// Protected Route Component
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_role');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role || 'viewer')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <Layout><SalesHistory /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><Products /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/stock" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><Stock /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/change-password" element={
            <ProtectedRoute>
              <Layout><ChangePassword /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch-all redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
