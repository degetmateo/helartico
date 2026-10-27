import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiClient } from "../services/apiClient";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("ApiClient Service", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should attach Authorization header when token exists", async () => {
    localStorage.setItem("helartico_token", "test_jwt_token_123");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { status: "ok" } }),
    });
    globalThis.fetch = mockFetch;

    const data = await ApiClient.request<{ status: string }>("/test");
    expect(data.status).toBe("ok");

    const callArgs = mockFetch.mock.calls[0];
    const headers = callArgs[1].headers;
    expect(headers["Authorization"]).toBe("Bearer test_jwt_token_123");
  });

  it("should throw an error with backend message when response fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, error: "Puntos insuficientes" }),
    });

    await expect(ApiClient.request("/fail")).rejects.toThrow("Puntos insuficientes");
  });

  it("should parse paginated response with metadata", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ id: "1", name: "Helado" }],
        pagination: { page: 1, limit: 10, total: 25, totalPages: 3, hasMore: true },
      }),
    });

    const res = await ApiClient.requestPaginated<{ id: string; name: string }>("/products");
    expect(res.items.length).toBe(1);
    expect(res.items[0].name).toBe("Helado");
    expect(res.pagination.total).toBe(25);
    expect(res.pagination.hasMore).toBe(true);
  });
});
