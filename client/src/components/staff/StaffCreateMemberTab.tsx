import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { ApiClient } from "../../services/apiClient";

export const StaffCreateMemberTab: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await ApiClient.request("/auth/staff/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, documentNumber, password }),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setDocumentNumber("");
      setPassword("");
    } catch (err: any) {
      alert(err.message || "Error al crear personal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#fff", padding: 20, borderRadius: 12, border: "1px solid var(--color-border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "var(--color-primary-light)", padding: 8, borderRadius: 10 }}>
          <UserPlus size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 style={{ fontSize: "1.05rem" }}>Dar de Alta Nuevo Personal</h3>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Solo miembros activos del staff pueden crear nuevos accesos administrativos.</p>
        </div>
      </div>

      {success && (
        <div style={{ background: "var(--color-success-bg)", color: "var(--color-success)", padding: 10, borderRadius: 8, fontSize: "0.85rem", marginBottom: 14 }}>
          ¡Miembro de staff registrado exitosamente!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
        <input type="email" placeholder="Correo electrónico institucional" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
        <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
        <input type="text" placeholder="Documento / DNI" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
        <input type="password" placeholder="Contraseña de acceso" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }} />
        
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 6, padding: 12, background: "var(--color-primary)", color: "#fff", borderRadius: 8, fontWeight: 700 }}
        >
          {loading ? "Creando..." : "Crear Usuario Staff"}
        </button>
      </form>
    </div>
  );
};
