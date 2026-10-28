import React, { useState } from "react";
import { Activity, LogOut, Package, QrCode, Shield, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { StaffAuditLogsTab } from "./StaffAuditLogsTab";
import { StaffCustomersTab } from "./StaffCustomersTab";
import { StaffManagementTab } from "./StaffManagementTab";
import { StaffProductsTab } from "./StaffProductsTab";
import { StaffValidatorTab } from "./StaffValidatorTab";

type StaffTab = "VALIDATOR" | "CUSTOMERS" | "PRODUCTS" | "STAFF_MANAGEMENT" | "AUDIT_LOGS";

export const StaffAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<StaffTab>("VALIDATOR");

  const isAdmin = user?.staffRole === "ADMIN";

  return (
    <div className="app-container staff-mode" style={{ minHeight: "100vh" }}>
      <header className="app-header" style={{ padding: "12px 18px", gap: 10 }}>
        <div className="brand-badge" style={{ minWidth: 0, flexShrink: 1 }}>
          <img src="/logo.png" alt="Helartico" />
          <div style={{ minWidth: 0 }}>
            <div className="brand-title">Helartico Staff</div>
            <div className="brand-subtitle" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Panel de Control
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: 120 }}>
            <span
              style={{
                fontSize: "0.84rem",
                color: "var(--color-text)",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
              title={user?.name}
            >
              {user?.name}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: isAdmin ? "var(--color-accent)" : "var(--color-primary)",
                background: isAdmin ? "var(--color-accent-soft)" : "var(--color-primary-light)",
                padding: "2px 6px",
                borderRadius: 6,
                marginTop: 2,
                whiteSpace: "nowrap",
              }}
            >
              {isAdmin ? "👑 Admin" : "💼 Empleado"}
            </span>
          </div>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "var(--color-danger-bg)",
              color: "var(--color-danger)",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: "0.8rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <div
        className="no-scrollbar"
        style={{
          padding: "10px 14px 0 14px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderBottom: "1px solid var(--color-border)",
          background: "#fff",
        }}
      >
        <button
          onClick={() => setActiveTab("VALIDATOR")}
          style={{
            padding: "8px 12px",
            borderBottom: activeTab === "VALIDATOR" ? "3px solid var(--color-primary)" : "none",
            color: activeTab === "VALIDATOR" ? "var(--color-primary)" : "var(--color-text-muted)",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <QrCode size={16} /> Validar Canjes
        </button>

        <button
          onClick={() => setActiveTab("CUSTOMERS")}
          style={{
            padding: "8px 12px",
            borderBottom: activeTab === "CUSTOMERS" ? "3px solid var(--color-primary)" : "none",
            color: activeTab === "CUSTOMERS" ? "var(--color-primary)" : "var(--color-text-muted)",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <Users size={16} /> Clientes & Puntos
        </button>

        <button
          onClick={() => setActiveTab("PRODUCTS")}
          style={{
            padding: "8px 12px",
            borderBottom: activeTab === "PRODUCTS" ? "3px solid var(--color-primary)" : "none",
            color: activeTab === "PRODUCTS" ? "var(--color-primary)" : "var(--color-text-muted)",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <Package size={16} /> Catálogo
        </button>

        {/* Tab strictly reserved for ADMINISTRATOR */}
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab("STAFF_MANAGEMENT")}
              style={{
                padding: "8px 12px",
                borderBottom: activeTab === "STAFF_MANAGEMENT" ? "3px solid var(--color-accent)" : "none",
                color: activeTab === "STAFF_MANAGEMENT" ? "var(--color-accent)" : "var(--color-text-muted)",
                fontWeight: 700,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Shield size={16} /> Gestión de Personal
            </button>

            <button
              onClick={() => setActiveTab("AUDIT_LOGS")}
              style={{
                padding: "8px 12px",
                borderBottom: activeTab === "AUDIT_LOGS" ? "3px solid var(--color-accent)" : "none",
                color: activeTab === "AUDIT_LOGS" ? "var(--color-accent)" : "var(--color-text-muted)",
                fontWeight: 700,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Activity size={16} /> Registros del Sistema
            </button>
          </>
        )}
      </div>

      <main className="staff-responsive-main" style={{ padding: 18, flex: 1 }}>
        {activeTab === "VALIDATOR" && <StaffValidatorTab />}
        {activeTab === "CUSTOMERS" && <StaffCustomersTab />}
        {activeTab === "PRODUCTS" && <StaffProductsTab />}
        {activeTab === "STAFF_MANAGEMENT" && isAdmin && <StaffManagementTab />}
        {activeTab === "AUDIT_LOGS" && isAdmin && <StaffAuditLogsTab />}
      </main>
    </div>
  );
};
