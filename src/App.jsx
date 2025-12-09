import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

function ProtectedRoute({ children }) {
  const { user } = useAuth();   // ← AQUÍ SE CORRIGE

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Sistema de Gestión Rocal</title>
        <meta 
          name="description" 
          content="Sistema integral de gestión de proveedores y precios para construcción" 
        />
      </Helmet>

      <Router>
        <Routes>

          {/* Página de login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard protegido */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Redirigir raíz a dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Router>

      {/* Sistema de alertas / toasts */}
      <Toaster />
    </AuthProvider>
  );
}
