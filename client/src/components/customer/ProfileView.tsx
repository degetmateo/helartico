import React, { useState } from "react";
import { Download, LogOut, Mail, Phone, ShieldCheck, Sparkles, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PwaPromptModal } from "../common/PwaPromptModal";

export const ProfileView: React.FC = () => {
  const { user, logout } = useAuth();
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);

  if (!user) return null;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.3rem" }}>Mi Perfil</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Detalles de tu cuenta Helartico.
        </p>
      </div>

      <div style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))", color: "#fff", padding: 20, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", opacity: 0.9, marginBottom: 4 }}>
          <Sparkles size={16} /> Saldo Acumulado
        </div>
        <div style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: -0.5 }}>
          {user.pointsBalance ?? 0} <span style={{ fontSize: "1rem", fontWeight: 500 }}>puntos</span>
        </div>
        <div style={{ fontSize: "0.78rem", opacity: 0.8, marginTop: 4 }}>
          Sumá más puntos con cada compra en nuestro local.
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", padding: 16, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid var(--color-border-subtle)" }}>
          <UserIcon size={18} color="var(--color-text-muted)" />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Nombre Completo</div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{user.name}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
          <Mail size={18} color="var(--color-text-muted)" />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Correo Electrónico</div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
          <Phone size={18} color="var(--color-text-muted)" />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Teléfono</div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{user.phone || "No especificado"}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12 }}>
          <ShieldCheck size={18} color="var(--color-text-muted)" />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Documento / DNI</div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{user.documentNumber}</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowPwaModal(true)}
        style={{
          width: "100%",
          background: "var(--color-primary-light)",
          color: "var(--color-primary)",
          padding: 12,
          borderRadius: 12,
          fontWeight: 700,
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <Download size={18} /> Instalá nuestra app
      </button>

      <button
        onClick={logout}
        style={{
          width: "100%",
          background: "none",
          border: "1px solid var(--color-border)",
          color: "var(--color-danger)",
          padding: 12,
          borderRadius: 12,
          fontWeight: 600,
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <LogOut size={18} /> Cerrar sesión
      </button>

      <PwaPromptModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </div>
  );
};
