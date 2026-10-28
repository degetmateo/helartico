import React, { useCallback, useEffect, useState } from "react";
import { Edit2, ImagePlus, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { ApiClient } from "../../services/apiClient";
import type { Product } from "../../types";

export const StaffProductsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 350);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pointsRequired, setPointsRequired] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editPoints, setEditPoints] = useState<string>("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);

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
          limit: "12",
        });
        if (search.trim()) {
          queryParams.set("search", search.trim());
        }

        const res = await ApiClient.requestPaginated<Product>(
          `/products/admin/all?${queryParams.toString()}`
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

  useEffect(() => {
    setPage(1);
    fetchProducts(1, debouncedSearch, false);
  }, [debouncedSearch, fetchProducts]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Por favor selecciona una imagen para el producto");
    setSubmitting(true);
    try {
      const imageUrl = await ApiClient.uploadImage(imageFile);
      await ApiClient.request("/products", {
        method: "POST",
        body: JSON.stringify({ name, imageUrl, pointsRequired: Number(pointsRequired) }),
      });
      setShowAdd(false);
      setName("");
      setImageFile(null);
      setImagePreview(null);
      setPointsRequired("");
      fetchProducts(1, debouncedSearch, false);
    } catch (err: any) {
      alert(err.message || "Error al crear producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditPoints(p.pointsRequired.toString());
    setEditIsActive(p.isActive);
    setEditImageFile(null);
    setEditImagePreview(p.imageUrl);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmittingEdit(true);
    try {
      let finalImageUrl = editingProduct.imageUrl;
      if (editImageFile) {
        finalImageUrl = await ApiClient.uploadImage(editImageFile);
      }

      const res = await ApiClient.request<Product>(
        `/products/${editingProduct.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editName,
            imageUrl: finalImageUrl,
            pointsRequired: Number(editPoints),
            isActive: editIsActive,
          }),
        }
      );

      // ApiClient.request automatically returns data.data if defined
      const updatedProduct: Product = (res as any)?.id ? res : (res as any)?.data;
      if (updatedProduct && updatedProduct.id) {
        setProducts((prev) =>
          prev.map((item) => (item?.id === editingProduct.id ? updatedProduct : item))
        );
      } else {
        fetchProducts(page, debouncedSearch, false);
      }
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message || "Error al actualizar producto");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (
      !confirm(
        `¿Querés eliminar "${p.name}" en su totalidad? Esta acción es irreversible y también eliminará su imagen del repositorio.`
      )
    ) {
      return;
    }
    try {
      await ApiClient.request(`/products/${p.id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(err.message || "Error al eliminar producto");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: "1.1rem" }}>Gestión del Catálogo</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            Administrá los productos y su costo en puntos.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      {/* Product Search Input */}
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
          placeholder="Buscá un producto por nombre..."
          style={{
            width: "100%",
            padding: "10px 36px 10px 38px",
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            background: "#fff",
            fontSize: "0.9rem",
            outline: "none",
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

      {!loading && (
        <div
          style={{
            fontSize: "0.82rem",
            color: "var(--color-text-muted)",
            marginBottom: 12,
          }}
        >
          {debouncedSearch
            ? `Resultados para "${debouncedSearch}" (${totalCount})`
            : `${totalCount} ${totalCount === 1 ? "producto registrado" : "productos registrados"}`}
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
          <span>Cargando productos...</span>
        </div>
      ) : products.length === 0 ? (
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
          <h4 style={{ fontSize: "1rem" }}>No se encontraron productos</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Probá buscando con otro término.
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {products
              .filter((p): p is Product => Boolean(p && p.id))
              .map((p) => (
                <div
                  key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  style={{ width: "100%", height: 110, objectFit: "cover" }}
                  loading="lazy"
                />
                <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{p.name}</div>
                    <div
                      style={{
                        color: "var(--color-accent)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        marginTop: 4,
                      }}
                    >
                      {p.pointsRequired} Puntos
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: p.isActive ? "var(--color-success)" : "var(--color-danger)",
                        fontWeight: 600,
                      }}
                    >
                      {p.isActive ? "Activo" : "Inactivo"}
                    </span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button
                        onClick={() => handleStartEdit(p)}
                        style={{
                          background: "var(--color-bg)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-primary)",
                          padding: "5px 8px",
                          borderRadius: 6,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                        title="Editar producto"
                      >
                        <Edit2 size={13} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        style={{
                          background: "var(--color-bg)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-danger)",
                          padding: "5px 7px",
                          borderRadius: 6,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Eliminar producto permanentemente"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite Scroll Sentinel */}
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
              <span>Cargando más productos...</span>
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
              }}
            >
              Has llegado al final de la lista
            </div>
          )}
        </>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 14 }}>Agregar Producto con Foto</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Nombre del producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />

              <div
                style={{
                  border: "2px dashed var(--color-border)",
                  borderRadius: 10,
                  padding: 14,
                  textAlign: "center",
                  background: "var(--color-bg)",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 8,
                      margin: "0 auto 8px auto",
                      display: "block",
                    }}
                  />
                ) : (
                  <ImagePlus
                    size={32}
                    color="var(--color-text-muted)"
                    style={{ margin: "0 auto 6px auto", display: "block" }}
                  />
                )}
                <label
                  style={{
                    cursor: "pointer",
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  <span>{imageFile ? "Cambiar foto" : "Seleccionar foto del producto"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <input
                type="number"
                min="1"
                placeholder="Puntos requeridos"
                value={pointsRequired}
                onChange={(e) => setPointsRequired(e.target.value)}
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
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
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: 10,
                    background: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 700,
                  }}
                >
                  {submitting ? "Subiendo..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 14 }}>Editar Producto</h3>
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Imagen del Producto
                </label>
                <div
                  style={{
                    border: "2px dashed var(--color-border)",
                    borderRadius: 10,
                    padding: 14,
                    textAlign: "center",
                    background: "var(--color-bg)",
                  }}
                >
                  {editImagePreview && (
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      style={{
                        width: 110,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 8,
                        margin: "0 auto 8px auto",
                        display: "block",
                      }}
                    />
                  )}
                  <label
                    style={{
                      cursor: "pointer",
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      display: "inline-block",
                      marginTop: 4,
                    }}
                  >
                    <span>{editImageFile ? "Cambiar foto seleccionada" : "Subir nueva foto"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Puntos Requeridos
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Puntos requeridos"
                  value={editPoints}
                  onChange={(e) => setEditPoints(e.target.value)}
                  required
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--color-border)" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  background: "var(--color-bg)",
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                }}
              >
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
                <label htmlFor="editIsActive" style={{ fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                  Producto activo para canje
                </label>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{
                    flex: 1,
                    padding: 10,
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  style={{
                    flex: 1,
                    padding: 10,
                    background: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {submittingEdit ? (
                    <>
                      <Loader2 size={16} className="spin-animation" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
