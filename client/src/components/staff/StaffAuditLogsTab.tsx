import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  Gift,
  LogIn,
  Package,
  RotateCcw,
  Search,
  Shield,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { ApiClient } from "../../services/apiClient";
import type { AuditCategory, AuditLogItem } from "../../types";

const CATEGORIES: { id: AuditCategory | "ALL"; label: string; icon: React.ReactNode }[] = [
  { id: "ALL", label: "Todos", icon: <Activity size={14} /> },
  { id: "POINTS", label: "Puntos", icon: <Award size={14} /> },
  { id: "REDEMPTION", label: "Canjes", icon: <Gift size={14} /> },
  { id: "PRODUCT", label: "Productos", icon: <Package size={14} /> },
  { id: "CUSTOMER", label: "Clientes", icon: <Users size={14} /> },
  { id: "STAFF", label: "Personal", icon: <Shield size={14} /> },
  { id: "AUTH", label: "Autenticación", icon: <LogIn size={14} /> },
];

const ACTION_OPTIONS: { value: string; label: string; category?: AuditCategory }[] = [
  { value: "", label: "Todas las acciones" },
  { value: "POINTS_ADD", label: "Suma de puntos", category: "POINTS" },
  { value: "POINTS_SET", label: "Ajuste arbitrario de puntos", category: "POINTS" },
  { value: "REDEMPTION_CREATE", label: "Canje generado por cliente", category: "REDEMPTION" },
  { value: "REDEMPTION_VALIDATE", label: "Canje validado por empleado", category: "REDEMPTION" },
  { value: "PRODUCT_CREATE", label: "Creación de producto", category: "PRODUCT" },
  { value: "PRODUCT_UPDATE", label: "Modificación de producto", category: "PRODUCT" },
  { value: "PRODUCT_DELETE", label: "Eliminación de producto", category: "PRODUCT" },
  { value: "CUSTOMER_REGISTER", label: "Registro directo de cliente", category: "CUSTOMER" },
  { value: "CUSTOMER_CREATE", label: "Alta de cliente por personal", category: "CUSTOMER" },
  { value: "CUSTOMER_UPDATE", label: "Modificación de cliente", category: "CUSTOMER" },
  { value: "STAFF_CREATE", label: "Alta de personal", category: "STAFF" },
  { value: "STAFF_UPDATE", label: "Modificación de personal", category: "STAFF" },
  { value: "STAFF_DELETE", label: "Baja de personal", category: "STAFF" },
  { value: "AUTH_LOGIN", label: "Inicio de sesión", category: "AUTH" },
];

export const StaffAuditLogsTab: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 350);

  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | "ALL">("ALL");
  const [selectedAction, setSelectedAction] = useState<string>("");

  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Expanded card details tracker
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const fetchLogs = useCallback(
    async (
      pageToFetch: number,
      categoryFilter: AuditCategory | "ALL",
      actionFilter: string,
      searchQuery: string,
      isAppend: boolean = false
    ) => {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const queryParams = new URLSearchParams({
          page: pageToFetch.toString(),
          limit: "15",
        });

        if (categoryFilter !== "ALL") {
          queryParams.set("category", categoryFilter);
        }
        if (actionFilter) {
          queryParams.set("action", actionFilter);
        }
        if (searchQuery.trim()) {
          queryParams.set("search", searchQuery.trim());
        }

        const res = await ApiClient.requestPaginated<AuditLogItem>(
          `/logs?${queryParams.toString()}`
        );

        if (isAppend) {
          setLogs((prev) => [...prev, ...res.items]);
        } else {
          setLogs(res.items);
        }

        setPage(res.pagination.page);
        setHasMore(res.pagination.hasMore);
        setTotalCount(res.pagination.total);
      } catch (err) {
        console.error("Error al cargar registros de auditoría:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Initial load and filter change trigger
  useEffect(() => {
    fetchLogs(1, selectedCategory, selectedAction, debouncedSearch, false);
  }, [fetchLogs, selectedCategory, selectedAction, debouncedSearch]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchLogs(page + 1, selectedCategory, selectedAction, debouncedSearch, true);
    }
  }, [fetchLogs, page, selectedCategory, selectedAction, debouncedSearch, loading, loadingMore, hasMore]);

  const { sentinelRef } = useInfiniteScroll({
    isLoading: loading || loadingMore,
    hasMore,
    onLoadMore: handleLoadMore,
  });

  const handleRefresh = () => {
    fetchLogs(1, selectedCategory, selectedAction, debouncedSearch, false);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category: AuditCategory) => {
    switch (category) {
      case "POINTS":
        return { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" };
      case "REDEMPTION":
        return { bg: "#E0F2FE", text: "#075985", border: "#BAE6FD" };
      case "PRODUCT":
        return { bg: "#EDE9FE", text: "#5B21B6", border: "#DDD6FE" };
      case "CUSTOMER":
        return { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" };
      case "STAFF":
        return { bg: "#FCE7F3", text: "#9D174D", border: "#FBCFE8" };
      case "AUTH":
        return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
      default:
        return { bg: "var(--color-bg)", text: "var(--color-text)", border: "var(--color-border)" };
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { label: "👑 Admin", bg: "var(--color-accent-soft)", color: "var(--color-accent)" };
      case "EMPLOYEE":
      case "STAFF":
        return { label: "💼 Empleado", bg: "var(--color-primary-light)", color: "var(--color-primary)" };
      case "CUSTOMER":
        return { label: "👤 Cliente", bg: "#E8F4EC", color: "#2E6B3E" };
      default:
        return { label: `⚙️ ${role}`, bg: "#F3F4F6", color: "#6B7280" };
    }
  };

  const filteredActionOptions = ACTION_OPTIONS.filter((opt) => {
    if (!opt.value) return true;
    if (selectedCategory === "ALL") return true;
    return opt.category === selectedCategory;
  });

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header Info */}
      <div
        style={{
          background: "#fff",
          padding: "14px 18px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: "1.15rem", color: "var(--color-text)", display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={20} color="var(--color-primary)" />
            Registros del Sistema
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: 2 }}>
            Historial inmutable de todas las operaciones realizadas en la plataforma.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            padding: "8px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.82rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          title="Actualizar registros"
        >
          <RotateCcw size={14} /> Actualizar
        </button>
      </div>

      {/* Filters Card */}
      <div
        style={{
          background: "#fff",
          padding: 14,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Search & Action Dropdown row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {/* Search Input */}
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
            />
            <input
              type="text"
              placeholder="Buscá por usuario, destinatario o detalle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 36px 9px 36px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                fontSize: "0.88rem",
                outline: "none",
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
                  background: "transparent",
                  color: "var(--color-text-muted)",
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Action Select */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                fontSize: "0.88rem",
                background: "#fff",
                outline: "none",
                fontWeight: 600,
                color: "var(--color-text)",
              }}
            >
              {filteredActionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedAction("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  background: isSelected ? "var(--color-primary)" : "var(--color-bg)",
                  color: isSelected ? "#fff" : "var(--color-text-muted)",
                  border: isSelected ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                  transition: "all 0.15s ease",
                }}
              >
                {cat.icon}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Total results indicator */}
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 4,
            borderTop: "1px solid var(--color-border-subtle)",
          }}
        >
          <span>
            Mostrando <strong>{logs.length}</strong> de <strong>{totalCount}</strong> eventos registrados
          </span>
          {selectedCategory !== "ALL" || selectedAction || search ? (
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedAction("");
                setSearch("");
              }}
              style={{
                background: "transparent",
                color: "var(--color-primary)",
                fontSize: "0.8rem",
                fontWeight: 700,
                textDecoration: "underline",
              }}
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {/* Logs Feed */}
      {loading ? (
        <div
          style={{
            background: "#fff",
            padding: 40,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "0.95rem",
          }}
        >
          Cargando registros del sistema...
        </div>
      ) : logs.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: 48,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            textAlign: "center",
          }}
        >
          <Activity size={36} color="var(--color-text-muted)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.05rem", color: "var(--color-text)", marginBottom: 4 }}>
            No se encontraron registros
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            No hay operaciones registradas que coincidan con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {logs.map((log) => {
            const catStyle = getCategoryColor(log.category);
            const roleStyle = getRoleBadge(log.actorRole);
            const isExpanded = expandedLogIds.has(log.id);
            const hasDetails = log.details && Object.keys(log.details).length > 0;

            return (
              <div
                key={log.id}
                style={{
                  background: "#fff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "var(--shadow-sm)",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                {/* Top Row: Category tag, Action, Timestamp */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: catStyle.bg,
                        color: catStyle.text,
                        border: `1px solid ${catStyle.border}`,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      {log.category}
                    </span>

                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        background: "var(--color-bg)",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontFamily: "monospace",
                      }}
                    >
                      {log.action}
                    </span>

                    {log.targetName && (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "var(--color-text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Tag size={12} /> Destino: <strong>{log.targetName}</strong>
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--color-text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontWeight: 600,
                    }}
                  >
                    <Clock size={13} /> {formatDateTime(log.createdAt)}
                  </span>
                </div>

                {/* Main Description */}
                <div
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--color-text)",
                    fontWeight: 600,
                    lineHeight: 1.45,
                  }}
                >
                  {log.description}
                </div>

                {/* Bottom Row: Actor info & Details toggle */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                    paddingTop: 8,
                    borderTop: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        background: roleStyle.bg,
                        color: roleStyle.color,
                      }}
                    >
                      {roleStyle.label}
                    </span>

                    <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
                      {log.actorName}
                    </span>

                    {log.actorEmail && (
                      <span style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>
                        ({log.actorEmail})
                      </span>
                    )}
                  </div>

                  {hasDetails && (
                    <button
                      onClick={() => toggleExpand(log.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "transparent",
                        color: "var(--color-accent)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        padding: "2px 6px",
                      }}
                    >
                      {isExpanded ? (
                        <>
                          Ocultar detalles <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          Ver detalles técnicos <ChevronDown size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Collapsible Details */}
                {hasDetails && isExpanded && (
                  <div
                    style={{
                      background: "var(--color-bg)",
                      borderRadius: "var(--radius-sm)",
                      padding: 12,
                      marginTop: 4,
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 6 }}>
                      DETALLES ADICIONALES:
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        fontSize: "0.76rem",
                        fontFamily: "monospace",
                        color: "var(--color-text)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}

          {/* Infinite Scroll Sentinel */}
          <div ref={sentinelRef} style={{ height: 24, textAlign: "center" }}>
            {loadingMore && (
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                Cargando más registros...
              </span>
            )}
            {!hasMore && logs.length > 0 && (
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                ✓ Llegaste al final de todos los registros disponibles.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
