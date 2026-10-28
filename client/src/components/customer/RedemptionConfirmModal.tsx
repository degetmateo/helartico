import React from "react";
import { AlertCircle, Gift, X } from "lucide-react";
import type { Product } from "../../types";

interface RedemptionConfirmModalProps {
  product: Product | null;
  customerPoints: number;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RedemptionConfirmModal: React.FC<RedemptionConfirmModalProps> = ({
  product,
  customerPoints,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  const pointsAfter = customerPoints - product.pointsRequired;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "var(--color-accent-soft)", padding: 8, borderRadius: 12 }}>
              <Gift size={22} color="var(--color-accent)" />
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>Confirmá tu canje</h3>
          </div>
          <button onClick={onClose} style={{ color: "var(--color-text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: 90, height: 90, borderRadius: 16, objectFit: "cover", marginBottom: 12, border: "1px solid var(--color-border)" }}
          />
          <h4 style={{ fontSize: "1.05rem", marginBottom: 4 }}>{product.name}</h4>
          <p style={{ color: "var(--color-accent)", fontWeight: 700, fontSize: "0.95rem" }}>
            {product.pointsRequired} Puntos
          </p>
        </div>

        <div style={{ background: "var(--color-bg)", borderRadius: 12, padding: "12px 16px", marginBottom: 18, fontSize: "0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "var(--color-text-muted)" }}>Tus puntos actuales:</span>
            <strong>{customerPoints} pts</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "var(--color-text-muted)" }}>Puntos a canjear:</span>
            <strong style={{ color: "var(--color-danger)" }}>-{product.pointsRequired} pts</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: 6 }}>
            <span>Saldo restante:</span>
            <strong style={{ color: "var(--color-primary)" }}>{pointsAfter} pts</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", background: "var(--color-accent-soft)", padding: 10, borderRadius: 10, marginBottom: 18, fontSize: "0.78rem", color: "var(--color-text)" }}>
          <AlertCircle size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
          <span>El código va a tener 30 minutos de validez y es de un solo uso en el mostrador.</span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid var(--color-border)", fontWeight: 600 }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{ flex: 1, padding: 12, borderRadius: 10, background: "var(--color-primary)", color: "#fff", fontWeight: 700 }}
          >
            {isLoading ? "Canjeando..." : "Sí, Canjeá"}
          </button>
        </div>
      </div>
    </div>
  );
};
