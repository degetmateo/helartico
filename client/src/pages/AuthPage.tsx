import React, { useState } from "react";
import { Smartphone } from "lucide-react";
import { PwaPromptModal } from "../components/common/PwaPromptModal";
import { useAuth } from "../context/AuthContext";

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [showPwaModal, setShowPwaModal] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await register({ name, email, phone, documentNumber, password });
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img src="/logo.png" alt="Helartico" style={{ width: 88, height: 88, borderRadius: "50%", marginBottom: 10, border: "2px solid var(--color-border)" }} />
        <h1 style={{ fontSize: "1.6rem", color: "var(--color-primary)" }}>Helartico</h1>
        <p style={{ fontSize: "0.88rem", color: "var(--color-accent)", fontWeight: 600 }}>Helados & Café • Club de Fidelidad</p>
      </div>

      <div style={{ background: "#fff", padding: 22, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", marginBottom: 18 }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            style={{ flex: 1, paddingBottom: 10, fontWeight: 700, fontSize: "0.95rem", color: !isRegister ? "var(--color-primary)" : "var(--color-text-muted)", borderBottom: !isRegister ? "2px solid var(--color-primary)" : "none" }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            style={{ flex: 1, paddingBottom: 10, fontWeight: 700, fontSize: "0.95rem", color: isRegister ? "var(--color-primary)" : "var(--color-text-muted)", borderBottom: isRegister ? "2px solid var(--color-primary)" : "none" }}
          >
            Registrarme
          </button>
        </div>

        {error && (
          <div style={{ background: "var(--color-danger-bg)", color: "var(--color-danger)", padding: 10, borderRadius: 8, fontSize: "0.82rem", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {isRegister && (
            <>
              <input type="text" placeholder="Nombre y Apellido" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
              <input type="tel" placeholder="Número de teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
              <input type="text" placeholder="Número de documento / DNI" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
            </>
          )}
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 8, padding: 12, background: "var(--color-primary)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem" }}
          >
            {loading ? "Procesando..." : isRegister ? "Crear Mi Cuenta" : "Ingresar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setShowPwaModal(true)}
          style={{ marginTop: 14, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 600 }}
        >
          <Smartphone size={15} /> ¿Cómo instalar la aplicación?
        </button>
      </div>

      <PwaPromptModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </div>
  );
};
