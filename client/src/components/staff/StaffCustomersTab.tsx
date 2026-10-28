import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Edit2,
  KeyRound,
  Loader2,
  PlusCircle,
  Search,
  SlidersHorizontal,
  UserPlus,
  X,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { PasswordInput } from "../common/PasswordInput";
import { ApiClient } from "../../services/apiClient";
import type { User } from "../../types";

export const StaffCustomersTab: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 350);

  const [customers, setCustomers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Points Modal State (Add points)
  const [selectedCustForPoints, setSelectedCustForPoints] = useState<User | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Set Arbitrary Points Modal State (Manual adjustment)
  const [selectedCustForSetPoints, setSelectedCustForSetPoints] = useState<User | null>(null);
  const [targetPoints, setTargetPoints] = useState<string>("");
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [showSetConfirm, setShowSetConfirm] = useState<boolean>(false);
  const [submittingSetPoints, setSubmittingSetPoints] = useState<boolean>(false);

  // New Customer Modal State
  const [showAddCustomer, setShowAddCustomer] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newDoc, setNewDoc] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("helartico123");

  // Edit Customer Modal State
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editPhone, setEditPhone] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editDoc, setEditDoc] = useState<string>("");
  const [editPassword, setEditPassword] = useState<string>("");
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);

  const fetchCustomers = useCallback(
    async (pageToFetch: number, query: string, isAppend: boolean = false) => {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const queryParams = new URLSearchParams({
          page: pageToFetch.toString(),
          limit: "10",
        });
        if (query.trim()) {
          queryParams.set("search", query.trim());
        }

        const res = await ApiClient.requestPaginated<User>(
          `/customers?${queryParams.toString()}`
        );

        if (isAppend) {
          setCustomers((prev) => [...prev, ...res.items]);
        } else {
          setCustomers(res.items);
        }

        setPage(res.pagination.page);
        setHasMore(res.pagination.hasMore);
        setTotalCount(res.pagination.total);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchCustomers(1, debouncedSearch, false);
  }, [debouncedSearch, fetchCustomers]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchCustomers(page + 1, debouncedSearch, true);
    }
  }, [loading, loadingMore, hasMore, page, debouncedSearch, fetchCustomers]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: loading || loadingMore,
  });

  const handleRegisterCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiClient.request("/customers", {
        method: "POST",
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          documentNumber: newDoc,
          password: newPassword,
        }),
      });
      alert(`¡Cliente ${newName} registrado con éxito!`);
      setShowAddCustomer(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewDoc("");
      fetchCustomers(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al registrar cliente");
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForPoints || !pointsToAdd) return;
    try {
      await ApiClient.request(`/customers/${selectedCustForPoints.id}/points`, {
        method: "POST",
        body: JSON.stringify({ points: Number(pointsToAdd), note }),
      });
      alert(`¡Puntos acreditados con éxito a ${selectedCustForPoints.name}!`);
      setSelectedCustForPoints(null);
      setPointsToAdd("");
      setNote("");
      fetchCustomers(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al sumar puntos");
    }
  };

  const openSetPointsModal = (cust: User) => {
    setSelectedCustForSetPoints(cust);
    setTargetPoints((cust.pointsBalance ?? 0).toString());
    setAdjustReason("");
    setShowSetConfirm(false);
  };

  const handleRequestSetPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForSetPoints || targetPoints === "") return;
    const num = Number(targetPoints);
    if (isNaN(num) || num < 0) {
      alert("Los puntos deben ser un número entero mayor o igual a 0");
      return;
    }
    setShowSetConfirm(true);
  };

  const handleConfirmSetPoints = async () => {
    if (!selectedCustForSetPoints || targetPoints === "") return;
    setSubmittingSetPoints(true);
    try {
      await ApiClient.request(`/customers/${selectedCustForSetPoints.id}/points`, {
        method: "PUT",
        body: JSON.stringify({
          points: Number(targetPoints),
          reason: adjustReason.trim() ? adjustReason.trim() : undefined,
        }),
      });
      alert(`¡Saldo de puntos de ${selectedCustForSetPoints.name} establecido en ${targetPoints} pts con éxito!`);
      setSelectedCustForSetPoints(null);
      setShowSetConfirm(false);
      setTargetPoints("");
      setAdjustReason("");
      fetchCustomers(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al establecer puntos");
    } finally {
      setSubmittingSetPoints(false);
    }
  };

  const openEditModal = (cust: User) => {
    setEditingCustomer(cust);
    setEditName(cust.name);
    setEditPhone(cust.phone || "");
    setEditEmail(cust.email);
    setEditDoc(cust.documentNumber || "");
    setEditPassword("");
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setSubmittingEdit(true);
    try {
      await ApiClient.request(`/customers/${editingCustomer.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          email: editEmail,
          documentNumber: editDoc,
          password: editPassword.trim() ? editPassword : undefined,
        }),
      });

      alert(`¡Cuenta del cliente ${editName} actualizada correctamente!`);
      setEditingCustomer(null);
      fetchCustomers(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al actualizar cuenta del cliente");
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 200px", minWidth: 0, position: "relative" }}>
          <Search
            size={18}
            color="var(--color-text-muted)"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscá por DNI, nombre o email..."
            style={{
              width: "100%",
              padding: "10px 36px 10px 38px",
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              outline: "none",
              fontSize: "0.9rem",
              background: "#fff",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAddCustomer(true)}
          style={{
            background: "var(--color-accent)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <UserPlus size={16} /> Nuevo Cliente
        </button>
      </div>

      {!loading && (
        <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: 12 }}>
          {debouncedSearch
            ? `Resultados para "${debouncedSearch}" (${totalCount})`
            : `${totalCount} ${totalCount === 1 ? "cliente registrado" : "clientes registrados"}`}
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: 30,
            color: "var(--color-text-muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Loader2 size={24} className="spin-animation" color="var(--color-primary)" />
          <span>Cargando clientes...</span>
        </div>
      ) : customers.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid var(--color-border)",
          }}
        >
          <Search size={36} color="var(--color-text-muted)" style={{ marginBottom: 10 }} />
          <h4 style={{ fontSize: "1rem" }}>No se encontraron clientes</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Probá con otro DNI, nombre o correo.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {customers.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Header row: Customer Name & Points Badge */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text)" }}>{c.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: 2, wordBreak: "break-word" }}>
                      DNI: <strong>{c.documentNumber}</strong> • {c.email}{c.phone ? ` • ${c.phone}` : ""}
                    </div>
                  </div>

                  <span
                    style={{
                      fontWeight: 800,
                      color: "var(--color-accent)",
                      background: "var(--color-accent-soft)",
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {c.pointsBalance ?? 0} pts
                  </span>
                </div>

                {/* Actions row: Responsive buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    paddingTop: 8,
                    borderTop: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <button
                    onClick={() => openEditModal(c)}
                    style={{
                      background: "var(--color-bg)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      padding: "6px 10px",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      whiteSpace: "nowrap",
                      flex: "1 1 auto",
                    }}
                    title="Editar datos o cambiar contraseña"
                  >
                    <Edit2 size={13} /> Editar
                  </button>

                  <button
                    onClick={() => setSelectedCustForPoints(c)}
                    style={{
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      whiteSpace: "nowrap",
                      flex: "1 1 auto",
                    }}
                  >
                    <PlusCircle size={14} /> Sumar Puntos
                  </button>

                  <button
                    onClick={() => openSetPointsModal(c)}
                    style={{
                      background: "#FFF4E5",
                      color: "#B76E00",
                      border: "1px solid #FFE2B5",
                      padding: "6px 10px",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      whiteSpace: "nowrap",
                      flex: "1 1 auto",
                    }}
                    title="Ajustar saldo manualmente"
                  >
                    <SlidersHorizontal size={13} /> Ajustar Saldo
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div ref={sentinelRef} style={{ height: 20, margin: "10px 0" }} />

          {loadingMore && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "16px 0",
                color: "var(--color-text-muted)",
                fontSize: "0.85rem",
              }}
            >
              <Loader2 size={18} className="spin-animation" color="var(--color-primary)" />
              <span>Cargando más clientes...</span>
            </div>
          )}

          {!hasMore && customers.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
              }}
            >
              Llegaste al final de la lista de clientes
            </div>
          )}
        </>
      )}

      {/* Modal: New Customer */}
      {showAddCustomer && (
        <div className="modal-overlay" onClick={() => setShowAddCustomer(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>Alta Asistida de Cliente</h3>
            <form onSubmit={handleRegisterCustomer} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <input
                type="tel"
                placeholder="Teléfono (Opcional)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <input
                type="text"
                placeholder="DNI / Documento"
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <PasswordInput
                placeholder="Contraseña (por defecto: helartico123)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  style={{
                    flex: 1,
                    padding: 10,
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: 10,
                    background: "var(--color-accent)",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 700,
                  }}
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Customer & Reset Password */}
      {editingCustomer && (
        <div className="modal-overlay" onClick={() => setEditingCustomer(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <KeyRound size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: "1.05rem", wordBreak: "break-word" }}>Modificar Cliente: {editingCustomer.name}</h3>
            </div>

            <form onSubmit={handleUpdateCustomer} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Nombre completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Teléfono (Opcional)</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Correo electrónico</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>DNI / Documento</label>
                <input
                  type="text"
                  value={editDoc}
                  onChange={(e) => setEditDoc(e.target.value)}
                  required
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)", outline: "none" }}
                />
              </div>

              <div style={{ background: "var(--color-bg)", padding: 12, borderRadius: 8, marginTop: 4 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: 4 }}>
                  Cambio / Reseteo de Contraseña
                </label>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: 6 }}>
                  Si el cliente olvidó su clave, ingresá una nueva acá para restablecerla. Dejá en blanco para conservar la actual.
                </p>
                <PasswordInput
                  placeholder="Nueva contraseña (mínimo 6 caracteres)"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  style={{ flex: 1, padding: 10, border: "1px solid var(--color-border)", borderRadius: 8 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  style={{ flex: 1, padding: 10, background: "var(--color-primary)", color: "#fff", borderRadius: 8, fontWeight: 700 }}
                >
                  {submittingEdit ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Points */}
      {selectedCustForPoints && (
        <div className="modal-overlay" onClick={() => setSelectedCustForPoints(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 12 }}>
              Acreditar Puntos a {selectedCustForPoints.name}
            </h3>
            <form onSubmit={handleAddPoints} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="number"
                min="1"
                placeholder="Cantidad de puntos a sumar"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <input
                type="text"
                placeholder="Motivo (ej. Compra helado 1kg)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setSelectedCustForPoints(null)}
                  style={{
                    flex: 1,
                    padding: 10,
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: 10,
                    background: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 700,
                  }}
                >
                  Acreditar
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => {
                    const c = selectedCustForPoints;
                    setSelectedCustForPoints(null);
                    openSetPointsModal(c);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-accent)",
                    fontSize: "0.8rem",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  ¿Deseas fijar o corregir el saldo a un número exacto? Ajuste manual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Set Arbitrary Points (Dangerous Action with Confirmation) */}
      {selectedCustForSetPoints && (
        <div className="modal-overlay" onClick={() => !submittingSetPoints && setSelectedCustForSetPoints(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div
                style={{
                  background: "#FEECEB",
                  color: "#B02A37",
                  padding: 6,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SlidersHorizontal size={18} />
              </div>
              <h3 style={{ fontSize: "1.1rem" }}>
                Establecer Saldo de Puntos
              </h3>
            </div>

            <div
              style={{
                background: "#FFF4E5",
                border: "1px solid #FFE2B5",
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <AlertTriangle size={18} color="#B76E00" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: "0.82rem", color: "#663C00", lineHeight: 1.4 }}>
                <strong>Acción delicada:</strong> Esta función sobrescribe arbitrariamente el saldo total de puntos de{" "}
                <strong>{selectedCustForSetPoints.name}</strong>. Úsala únicamente para corregir errores de suma o ajustes manuales autorizados.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--color-bg)",
                padding: "10px 12px",
                borderRadius: 8,
                marginBottom: 14,
                fontSize: "0.88rem",
              }}
            >
              <span style={{ color: "var(--color-text-muted)" }}>Saldo actual:</span>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-primary)" }}>
                {selectedCustForSetPoints.pointsBalance ?? 0} pts
              </span>
            </div>

            {!showSetConfirm ? (
              <form onSubmit={handleRequestSetPoints} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                    Nuevo saldo total de puntos
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ej. 150"
                    value={targetPoints}
                    onChange={(e) => setTargetPoints(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  />
                  {targetPoints !== "" && !isNaN(Number(targetPoints)) && (
                    <div style={{ fontSize: "0.78rem", marginTop: 4, color: "var(--color-text-muted)" }}>
                      Diferencia resultante:{" "}
                      <strong
                        style={{
                          color:
                            Number(targetPoints) - (selectedCustForSetPoints.pointsBalance ?? 0) >= 0
                              ? "var(--color-primary)"
                              : "var(--color-alert)",
                        }}
                      >
                        {Number(targetPoints) - (selectedCustForSetPoints.pointsBalance ?? 0) >= 0 ? "+" : ""}
                        {Number(targetPoints) - (selectedCustForSetPoints.pointsBalance ?? 0)} pts
                      </strong>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                    Motivo o justificativo del ajuste
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Corrección por error de carga en caja"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCustForSetPoints(null)}
                    style={{
                      flex: 1,
                      padding: 10,
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: 10,
                      background: "var(--color-accent)",
                      color: "#fff",
                      borderRadius: 8,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    Continuar <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{ textAlign: "center", marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const c = selectedCustForSetPoints;
                      setSelectedCustForSetPoints(null);
                      setSelectedCustForPoints(c);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      fontSize: "0.8rem",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    ¿Solo querías sumar puntos por compra? Acreditar puntos
                  </button>
                </div>
              </form>
            ) : (
              <div
                style={{
                  background: "#FEECEB",
                  border: "1.5px solid #F5C2C7",
                  padding: 16,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#842029" }}>
                  <AlertTriangle size={20} />
                  <strong style={{ fontSize: "0.95rem" }}>¿Confirmás este cambio directo de saldo?</strong>
                </div>

                <p style={{ fontSize: "0.85rem", color: "#66141D", lineHeight: 1.45, margin: 0 }}>
                  Estás a punto de reemplazar el saldo de{" "}
                  <strong>{selectedCustForSetPoints.name}</strong> (DNI: {selectedCustForSetPoints.documentNumber}) de{" "}
                  <strong style={{ textDecoration: "line-through" }}>{selectedCustForSetPoints.pointsBalance ?? 0} pts</strong> a{" "}
                  <strong style={{ fontSize: "0.95rem", color: "#842029" }}>{targetPoints} pts</strong>.
                  <br />
                  Esta acción quedará registrada en el historial de transacciones con tipo de ajuste manual.
                </p>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    disabled={submittingSetPoints}
                    onClick={() => setShowSetConfirm(false)}
                    style={{
                      flex: 1,
                      padding: 10,
                      border: "1px solid var(--color-border)",
                      background: "#fff",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    Volvé y modificá
                  </button>
                  <button
                    type="button"
                    disabled={submittingSetPoints}
                    onClick={handleConfirmSetPoints}
                    style={{
                      flex: 1,
                      padding: 10,
                      background: "#B02A37",
                      color: "#fff",
                      borderRadius: 8,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {submittingSetPoints ? (
                      <>
                        <Loader2 size={16} className="spin-animation" />
                        Guardando...
                      </>
                    ) : (
                      "Sí, Confirmar Ajuste"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
