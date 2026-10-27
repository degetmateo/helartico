import React, { useState } from "react";
import { LogOut, Package, QrCode, Shield, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { StaffCustomersTab } from "./StaffCustomersTab";
import { StaffManagementTab } from "./StaffManagementTab";
import { StaffProductsTab } from "./StaffProductsTab";
import { StaffValidatorTab } from "./StaffValidatorTab";

type StaffTab = "VALIDATOR" | "CUSTOMERS" | "PRODUCTS" | "STAFF_MANAGEMENT";

export const StaffAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<StaffTab>("VALIDATOR");

  const isAdmin = user?.staffRole === "ADMIN";

  return (
    <div className="app-container staff-mode" style={{ minHeight: "100vh" }}>
      <header className="app-header" style={{ padding: "12px 20px" }}>
        <div className="brand-badge">
          <img src="/logo.png" alt="Helartico" />
          <div>
            <div className="brand-title">Helartico Staff</div>
            <div className="brand-subtitle">Panel Administrativo de Caja y Clientes</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text)", fontWeight: 700 }}>
              {user?.name}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: isAdmin ? "var(--color-accent)" : "var(--color-primary)",
                background: isAdmin ? "var(--color-accent-soft)" : "var(--color-primary-light)",
                padding: "2px 8px",
                borderRadius: 6,
                marginTop: 2,
              }}
            >
              {isAdmin ? "👑 Administrador" : "💼 Empleado"}
            </span>
          </div>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--color-danger-bg)",
              color: "var(--color-danger)",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            <LogOut size={15} /> Salir
          </button>
        </div>
      </header>

      <div
        style={{
          padding: "16px 20px 0 20px",
          display: "flex",
          gap: 10,
          overflowX: "auto",
          borderBottom: "1px solid var(--color-border)",
          background: "#fff",
        }}
      >
        <button
          onClick={() => setActiveTab("VALIDATOR")}
          style={{
            padding: "10px 16px",
            borderBottom: activeTab === "VALIDATOR" ? "3px solid var(--color-primary)" : "none",
            color: activeTab === "VALIDATOR" ? "var(--color-primary)" : "var(--color-text-muted)",
            fontWeight: 700,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <QrCode size={18} /> Validar Canjes
        </button>

        <button
          onClick={() => setActiveTab("CUSTOMERS")}
          style={{
            padding: "10px 16px",
            borderBottom: activeTab === "CUSTOMERS" ? "3px solid var(--color-primary)" : "none",
            color: activeTab === "CUSTOMERS" ? "var(--color-primary)" : "var(--color-text-muted)",
            fontWeight: 700,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <Users size={18} /> Clientes & Puntos
        </button>

        <button
          onClick={() => setActiveTab("PRODUCTS")}
          style={{
            padding: "10px 16px",
            borderBottom: activeTab === "PRODUCTS" ? "3px solid var(--color-primary)" : "none",
            color: activeTab === "PRODUCTS" ? "var(--color-primary)" : "var(--color-text-muted)",
            fontWeight: 700,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <Package size={18} /> Catálogo
        </button>

        {/* Tab strictly reserved for ADMINISTRATOR */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab("STAFF_MANAGEMENT")}
            style={{
              padding: "10px 16px",
              borderBottom: activeTab === "STAFF_MANAGEMENT" ? "3px solid var(--color-accent)" : "none",
              color: activeTab === "STAFF_MANAGEMENT" ? "var(--color-accent)" : "var(--color-text-muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            <Shield size={18} /> Gestión de Personal
          </button>
        )}
      </div>

      <main style={{ padding: 20, flex: 1 }}>
        {activeTab === "VALIDATOR" && <StaffValidatorTab />}
        {activeTab === "CUSTOMERS" && <StaffCustomersTab />}
        {activeTab === "PRODUCTS" && <StaffProductsTab />}
        {activeTab === "STAFF_MANAGEMENT" && isAdmin && <StaffManagementTab />}
      </main>
    </div>
  );
};
