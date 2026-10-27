import React, { useCallback, useEffect, useState } from "react";
import { Gift, Loader2, Search, Sparkles, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { ApiClient } from "../../services/apiClient";
import type { Product } from "../../types";
import { RedemptionConfirmModal } from "./RedemptionConfirmModal";

interface CatalogViewProps {
  userPoints: number;
  onRedeemSuccess: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ userPoints, onRedeemSuccess }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 350);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [redeeming, setRedeeming] = useState<boolean>(false);

  // Fetch a specific page
  const fetchProducts = useCallback(
    async (pageToFetch: number, search: string, isAppend: boolean = false) => {
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
        if (search.trim()) {
          queryParams.set("search", search.trim());
        }

        const res = await ApiClient.requestPaginated<Product>(
          `/products?${queryParams.toString()}`
        );

        if (isAppend) {
          setProducts((prev) => [...prev, ...res.items]);
        } else {
          setProducts(res.items);
        }

        setPage(res.pagination.page);
        setHasMore(res.pagination.hasMore);
        setTotalCount(res.pagination.total);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // When search changes, reset and load page 1
  useEffect(() => {
    setPage(1);
    fetchProducts(1, debouncedSearch, false);
  }, [debouncedSearch, fetchProducts]);

  // Load more on scroll
  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchProducts(page + 1, debouncedSearch, true);
    }
  }, [loading, loadingMore, hasMore, page, debouncedSearch, fetchProducts]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: loading || loadingMore,
  });

  const handleConfirmRedeem = async () => {
    if (!selectedProduct) return;
    setRedeeming(true);
    try {
      await ApiClient.request("/redemptions/redeem", {
        method: "POST",
        body: JSON.stringify({ productId: selectedProduct.id }),
      });
      setSelectedProduct(null);
      onRedeemSuccess();
    } catch (err: any) {
      alert(err.message || "Error al canjear producto");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: "1.3rem" }}>Catálogo de Recompensas</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Canjea tus puntos acumulados por helados y café artesanal.
        </p>
      </div>

      {/* Product Search Bar */}
      <div style={{ position: "relative", marginBottom: 16 }}>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar helados, café, tortas..."
          style={{
            width: "100%",
            padding: "10px 36px 10px 38px",
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            background: "#fff",
            fontSize: "0.9rem",
            outline: "none",
            boxShadow: "var(--shadow-sm)",
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
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

      {/* Results header / count */}
      {!loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            fontSize: "0.82rem",
            color: "var(--color-text-muted)",
          }}
        >
          <span>
            {debouncedSearch
              ? `Resultados para "${debouncedSearch}" (${totalCount})`
              : `${totalCount} ${totalCount === 1 ? "producto disponible" : "productos disponibles"}`}
          </span>
        </div>
      )}

      {/* Initial Loading Skeleton / Message */}
      {loading ? (
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
          <span>Cargando catálogo...</span>
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#fff",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Search size={36} color="var(--color-text-muted)" style={{ marginBottom: 10 }} />
          <h4 style={{ fontSize: "1rem", marginBottom: 4 }}>No se encontraron productos</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Intenta con otro término de búsqueda.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {products.map((product) => {
              const canRedeem = userPoints >= product.pointsRequired;
              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: "100%", height: 120, objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      padding: 10,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "0.9rem", lineHeight: 1.3, marginBottom: 6 }}>
                        {product.name}
                      </h4>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "var(--color-accent-soft)",
                          color: "var(--color-accent)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          marginBottom: 10,
                        }}
                      >
                        <Sparkles size={13} /> {product.pointsRequired} pts
                      </div>
                    </div>

                    <button
                      disabled={!canRedeem}
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        borderRadius: 8,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        background: canRedeem ? "var(--color-primary)" : "var(--color-border)",
                        color: canRedeem ? "#fff" : "var(--color-text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: canRedeem ? "pointer" : "not-allowed",
                      }}
                    >
                      <Gift size={15} /> {canRedeem ? "Canjear" : "Faltan puntos"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sentinel for Infinite Scroll */}
          <div ref={sentinelRef} style={{ height: 20, margin: "10px 0" }} />

          {/* Loading More Indicator */}
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
              <span>Cargando más productos...</span>
            </div>
          )}

          {/* End of list badge */}
          {!hasMore && products.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
              }}
            >
              Has llegado al final del catálogo ✨
            </div>
          )}
        </>
      )}

      <RedemptionConfirmModal
        product={selectedProduct}
        customerPoints={userPoints}
        isOpen={!!selectedProduct}
        isLoading={redeeming}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleConfirmRedeem}
      />
    </div>
  );
};
