import React, { useCallback, useEffect, useState } from "react";
import { Edit2, Loader2, Plus, Search, Shield, Trash2, UserCheck, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { PasswordInput } from "../common/PasswordInput";
import { ApiClient } from "../../services/apiClient";
import type { StaffRole, User } from "../../types";

export const StaffManagementTab: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 350);

  const [staffList, setStaffList] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);

  // Create Form State
  const [createName, setCreateName] = useState<string>("");
  const [createEmail, setCreateEmail] = useState<string>("");
  const [createPhone, setCreatePhone] = useState<string>("");
  const [createDoc, setCreateDoc] = useState<string>("");
  const [createPassword, setCreatePassword] = useState<string>("");
  const [createRole, setCreateRole] = useState<StaffRole>("EMPLOYEE");
  const [submittingCreate, setSubmittingCreate] = useState<boolean>(false);

  // Edit Form State
  const [editName, setEditName] = useState<string>("");
  const [editPhone, setEditPhone] = useState<string>("");
  const [editDoc, setEditDoc] = useState<string>("");
  const [editRole, setEditRole] = useState<StaffRole>("EMPLOYEE");
  const [editNewPassword, setEditNewPassword] = useState<string>("");
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);

  const fetchStaff = useCallback(
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
          `/staff?${queryParams.toString()}`
        );

        if (isAppend) {
          setStaffList((prev) => [...prev, ...res.items]);
        } else {
          setStaffList(res.items);
        }

        setPage(res.pagination.page);
        setHasMore(res.pagination.hasMore);
        setTotalCount(res.pagination.total);
      } catch (err) {
        console.error("Failed to load staff list", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchStaff(1, debouncedSearch, false);
  }, [debouncedSearch, fetchStaff]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchStaff(page + 1, debouncedSearch, true);
    }
  }, [loading, loadingMore, hasMore, page, debouncedSearch, fetchStaff]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: loading || loadingMore,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCreate(true);
    try {
      await ApiClient.request("/staff", {
        method: "POST",
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          phone: createPhone.trim() || undefined,
          documentNumber: createDoc.trim() || undefined,
          password: createPassword,
          role: createRole,
        }),
      });

      alert(`¡Miembro del personal ${createName} creado con éxito!`);
      setShowCreateModal(false);
      setCreateName("");
      setCreateEmail("");
      setCreatePhone("");
      setCreateDoc("");
      setCreatePassword("");
      setCreateRole("EMPLOYEE");
      fetchStaff(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al crear personal");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const openEditModal = (staff: User) => {
    setEditingStaff(staff);
    setEditName(staff.name);
    setEditPhone(staff.phone || "");
    setEditDoc(staff.documentNumber || "");
    setEditRole(staff.staffRole || "EMPLOYEE");
    setEditNewPassword("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setSubmittingEdit(true);
    try {
      await ApiClient.request(`/staff/${editingStaff.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          phone: editPhone.trim() || "",
          documentNumber: editDoc.trim() || "",
          role: editRole,
          password: editNewPassword.trim() ? editNewPassword : undefined,
        }),
      });

      alert(`¡Datos del personal ${editName} actualizados con éxito!`);
      setEditingStaff(null);
      fetchStaff(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al actualizar personal");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDelete = async (staff: User) => {
    if (staff.id === currentUser?.id) {
      alert("No puedes eliminar tu propia cuenta de administrador en sesión.");
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar al miembro del staff ${staff.name}?`)) {
      return;
    }

    try {
      await ApiClient.request(`/staff/${staff.id}`, { method: "DELETE" });
      alert("Miembro del staff eliminado correctamente.");
      fetchStaff(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: "1.15rem" }}>Gestión Integral del Personal</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            Solo administradores pueden dar de alta, modificar y dar de baja miembros del equipo.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            padding: "9px 16px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <Plus size={16} /> Nuevo Personal
        </button>
      </div>

      {/* Staff Search input */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search
          size={18}
          color="var(--color-text-muted)"
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscá por nombre, correo o DNI..."
          style={{
            width: "100%",
            padding: "10px 36px 10px 38px",
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            background: "#fff",
            outline: "none",
            fontSize: "0.9rem",
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

      {!loading && (
        <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: 12 }}>
          {debouncedSearch
            ? `Resultados para "${debouncedSearch}" (${totalCount})`
            : `${totalCount} ${totalCount === 1 ? "miembro registrado" : "miembros registrados"}`}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 30, color: "var(--color-text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Loader2 size={24} className="spin-animation" color="var(--color-primary)" />
          <span>Cargando miembros del personal...</span>
        </div>
      ) : staffList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 12, border: "1px solid var(--color-border)" }}>
          <Search size={36} color="var(--color-text-muted)" style={{ marginBottom: 10 }} />
          <h4 style={{ fontSize: "1rem" }}>No se encontró personal</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Probá con otro término de búsqueda.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {staffList.map((s) => {
              const isAdmin = s.staffRole === "ADMIN";
              const isSelf = s.id === currentUser?.id;
              return (
                <div
                  key={s.id}
                  style={{
                    background: "#fff",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10,
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ minWidth: 0, flex: "1 1 200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{s.name}</span>
                      {isSelf && (
                        <span style={{ fontSize: "0.72rem", background: "var(--color-primary-light)", color: "var(--color-primary)", padding: "2px 6px", borderRadius: 6, fontWeight: 700 }}>
                          (Vos)
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: isAdmin ? "var(--color-accent-soft)" : "var(--color-primary-light)",
                          color: isAdmin ? "var(--color-accent)" : "var(--color-primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isAdmin ? <Shield size={12} /> : <UserCheck size={12} />}
                        {isAdmin ? "Administrador" : "Empleado"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: 4, wordBreak: "break-word" }}>
                      {s.email}
                      {s.phone ? ` • Tel: ${s.phone}` : " • Sin teléfono"}
                      {s.documentNumber ? ` • DNI: ${s.documentNumber}` : " • Sin DNI"}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => openEditModal(s)}
                      style={{
                        background: "var(--color-bg)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Edit2 size={13} /> Editar
                    </button>

                    {!isSelf && (
                      <button
                        onClick={() => handleDelete(s)}
                        style={{
                          background: "var(--color-danger-bg)",
                          color: "var(--color-danger)",
                          padding: "6px 10px",
                          borderRadius: 8,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          whiteSpace: "nowrap",
                        }}
                        title="Eliminar usuario"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={sentinelRef} style={{ height: 20, margin: "10px 0" }} />

          {loadingMore && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              <Loader2 size={18} className="spin-animation" color="var(--color-primary)" />
              <span>Cargando más miembros...</span>
            </div>
          )}

          {!hasMore && staffList.length > 0 && (
            <div style={{ textAlign: "center", padding: "16px 0", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              Llegaste al final de la lista de personal
            </div>
          )}
        </>
      )}

      {/* Modal: Create Staff Member */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: 8, wordBreak: "break-word" }}>Dar de Alta Nuevo Personal</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: 12 }}>
              DNI y Teléfono son opcionales. Podés asignar el rol de Empleado o Administrador.
            </p>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Nombre completo *"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <input
                type="email"
                placeholder="Correo electrónico *"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <input
                type="tel"
                placeholder="Teléfono (Opcional)"
                value={createPhone}
                onChange={(e) => setCreatePhone(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <input
                type="text"
                placeholder="DNI / Documento (Opcional)"
                value={createDoc}
                onChange={(e) => setCreateDoc(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <PasswordInput
                placeholder="Contraseña de acceso *"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                required
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text)" }}>
                  Rol / Jerarquía en Staff:
                </label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as StaffRole)}
                  style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)", background: "#fff", fontWeight: 600 }}
                >
                  <option value="EMPLOYEE">💼 Empleado (Caja, clientes, puntos y canjes)</option>
                  <option value="ADMIN">👑 Administrador (Acceso total y gestión de staff)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ flex: 1, padding: 10, border: "1px solid var(--color-border)", borderRadius: 8 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  style={{ flex: 1, padding: 10, background: "var(--color-primary)", color: "#fff", borderRadius: 8, fontWeight: 700 }}
                >
                  {submittingCreate ? "Creando..." : "Crear Personal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Staff Member */}
      {editingStaff && (
        <div className="modal-overlay" onClick={() => setEditingStaff(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: 12, wordBreak: "break-word" }}>Editar Personal: {editingStaff.name}</h3>
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Nombre completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Teléfono (Opcional)</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Sin teléfono"
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>DNI / Documento (Opcional)</label>
                <input
                  type="text"
                  value={editDoc}
                  onChange={(e) => setEditDoc(e.target.value)}
                  placeholder="Sin DNI"
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Rol / Jerarquía</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as StaffRole)}
                  disabled={editingStaff.id === currentUser?.id}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)", background: "#fff", fontWeight: 600 }}
                >
                  <option value="EMPLOYEE">💼 Empleado</option>
                  <option value="ADMIN">👑 Administrador</option>
                </select>
                {editingStaff.id === currentUser?.id && (
                  <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>No podés quitarte el rol de Administrador a vos mismo.</span>
                )}
              </div>

              <div style={{ background: "var(--color-bg)", padding: 10, borderRadius: 8, marginTop: 4 }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: 4 }}>
                  Cambiar Contraseña (Opcional)
                </label>
                <PasswordInput
                  value={editNewPassword}
                  onChange={(e) => setEditNewPassword(e.target.value)}
                  placeholder="Dejá vacío para conservar la actual"
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
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
    </div>
  );
};
