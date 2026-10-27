import React from "react";
import { CustomerAppLayout } from "./components/customer/CustomerAppLayout";
import { StaffAdminDashboard } from "./components/staff/StaffAdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="Helartico"
          style={{ width: 72, height: 72, borderRadius: "50%", animation: "pulse 1.5s infinite" }}
        />
        <div style={{ marginTop: 12, fontWeight: 600, color: "var(--color-primary)" }}>
          Cargando Helartico...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (user.role === "STAFF") {
    return <StaffAdminDashboard />;
  }

  return <CustomerAppLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
