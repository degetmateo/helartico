import React, { useState } from "react";
import { Camera, CheckCircle2, QrCode, XCircle } from "lucide-react";
import { ApiClient } from "../../services/apiClient";
import { QrCameraScanner } from "./QrCameraScanner";

export const StaffValidatorTab: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCodeInput = (val: string): string => {
    const raw = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!raw) return "";
    if (raw.startsWith("HLT")) {
      const rest = raw.substring(3).slice(0, 6);
      return rest ? `HLT-${rest}` : "HLT-";
    }
    return `HLT-${raw.slice(0, 6)}`;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(formatCodeInput(e.target.value));
  };

  const validateCodeString = async (codeToValidate: string) => {
    if (!codeToValidate.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await ApiClient.request("/redemptions/validate", {
        method: "POST",
        body: JSON.stringify({ code: codeToValidate.trim().toUpperCase() }),
      });
      setResult(data);
      setCode("");
    } catch (err: any) {
      setError(err.message || "Error al validar el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Validación de Canjes</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Escaneá el código QR del cliente o ingresá el código manual.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowScanner(!showScanner)}
        style={{
          width: "100%",
          padding: 12,
          background: showScanner ? "var(--color-bg)" : "var(--color-accent)",
          color: showScanner ? "var(--color-text)" : "#fff",
          borderRadius: "var(--radius-md)",
          fontWeight: 700,
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 16,
          border: showScanner ? "1px solid var(--color-border)" : "none",
        }}
      >
        <Camera size={18} /> {showScanner ? "Ocultar cámara escáner" : "Abrir cámara para escanear QR"}
      </button>

      {showScanner && (
        <QrCameraScanner
          onScan={(scannedCode) => {
            setShowScanner(false);
            validateCodeString(scannedCode);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      <form onSubmit={(e) => { e.preventDefault(); validateCodeString(code); }} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="HLT-XXXXXX"
          style={{
            width: "100%",
            padding: "14px 16px",
            fontFamily: "monospace",
            fontSize: "1.3rem",
            fontWeight: 700,
            letterSpacing: 2,
            textAlign: "center",
            borderRadius: "var(--radius-md)",
            border: "2px solid var(--color-primary)",
            outline: "none",
          }}
        />

        <button
          type="submit"
          disabled={loading || !code.trim() || code === "HLT-"}
          style={{
            padding: 14,
            background: "var(--color-primary)",
            color: "#fff",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <QrCode size={20} /> {loading ? "Verificando..." : "Validar y consumir canje"}
        </button>
      </form>

      {result && (
        <div style={{ background: "var(--color-success-bg)", border: "1.5px solid var(--color-success)", borderRadius: "var(--radius-md)", padding: 18, textAlign: "center" }}>
          <CheckCircle2 size={36} color="var(--color-success)" style={{ marginBottom: 8 }} />
          <h4 style={{ color: "var(--color-success)", fontSize: "1.1rem", marginBottom: 6 }}>¡Código válido y consumido!</h4>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text)", marginBottom: 4 }}>
            Entregar producto: {result.productName}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Cliente: {result.customerName} (Doc: {result.customerDocument})
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "var(--color-danger-bg)", border: "1.5px solid var(--color-danger)", borderRadius: "var(--radius-md)", padding: 18, textAlign: "center" }}>
          <XCircle size={36} color="var(--color-danger)" style={{ marginBottom: 8 }} />
          <h4 style={{ color: "var(--color-danger)", fontSize: "1.05rem", marginBottom: 4 }}>No se pudo validar el canje</h4>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text)" }}>{error}</p>
        </div>
      )}
    </div>
  );
};
