import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, Copy, Loader2, QrCode, Ticket, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { ApiClient } from "../../services/apiClient";
import type { RedemptionCodeItem } from "../../types";

export const RedemptionsView: React.FC = () => {
  const [redemptions, setRedemptions] = useState<RedemptionCodeItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchRedemptions = useCallback(
    async (pageToFetch: number, isAppend: boolean = false) => {
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await ApiClient.requestPaginated<RedemptionCodeItem>(
          `/redemptions/my?page=${pageToFetch}&limit=10`
        );

        if (isAppend) {
          setRedemptions((prev) => [...prev, ...res.items]);
        } else {
          setRedemptions(res.items);
        }

        setPage(res.pagination.page);
        setHasMore(res.pagination.hasMore);
      } catch (err) {
        console.error("Failed to load redemptions", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRedemptions(1, false);
    // Periodically update active redemptions on page 1 every 30s
    const interval = setInterval(() => {
      fetchRedemptions(1, false);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchRedemptions]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchRedemptions(page + 1, true);
    }
  }, [loading, loadingMore, hasMore, page, fetchRedemptions]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: loading || loadingMore,
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMinutesRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / 60000);
  };

  if (loading && redemptions.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 0",
          color: "var(--color-text-muted)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Loader2 size={24} className="spin-animation" color="var(--color-primary)" />
        <span>Cargando canjes...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.3rem" }}>Mis Códigos de Canje</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Muestra el código QR o el texto en caja antes de que expire (30 min).
        </p>
      </div>

      {redemptions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#fff",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Ticket size={40} color="var(--color-text-muted)" style={{ marginBottom: 12 }} />
          <h4 style={{ fontSize: "1rem" }}>Aún no tienes canjes</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Explora el catálogo y canjea tus puntos.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {redemptions.map((item) => {
              const minutes = getMinutesRemaining(item.expiresAt);
              const isActive = item.status === "ACTIVE" && minutes > 0;
              return (
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    borderRadius: "var(--radius-md)",
                    padding: 16,
                    border: isActive
                      ? "2px solid var(--color-primary)"
                      : "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "0.95rem" }}>{item.productName}</h4>
                      <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                        {new Date(item.createdAt).toLocaleDateString()} • {item.pointsSpent} pts
                      </span>
                    </div>
                    {item.status === "CONSUMED" ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "var(--color-success-bg)",
                          color: "var(--color-success)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        <CheckCircle2 size={13} /> Canjeado
                      </span>
                    ) : isActive ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "var(--color-accent-soft)",
                          color: "var(--color-accent)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        <Clock size={13} /> {minutes} min restantes
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "var(--color-danger-bg)",
                          color: "var(--color-danger)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        <XCircle size={13} /> Expirado
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "10px 0 14px 0",
                        padding: 12,
                        background: "var(--color-bg)",
                        borderRadius: 12,
                      }}
                    >
                      <QRCodeSVG
                        value={item.code}
                        size={130}
                        level="M"
                        fgColor="#222D20"
                        bgColor="transparent"
                      />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-muted)",
                          marginTop: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <QrCode size={13} /> Escanear en caja
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "var(--color-bg)",
                      padding: "10px 14px",
                      borderRadius: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        letterSpacing: 2,
                        color: "var(--color-primary)",
                      }}
                    >
                      {item.code}
                    </span>
                    <button
                      onClick={() => handleCopy(item.code)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.78rem",
                        color: "var(--color-primary)",
                        fontWeight: 600,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Copy size={15} /> {copiedCode === item.code ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sentinel for Infinite Scroll */}
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
              <span>Cargando más canjes...</span>
            </div>
          )}

          {!hasMore && redemptions.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
              }}
            >
              Has llegado al final de tu historial
            </div>
          )}
        </>
      )}
    </div>
  );
};
