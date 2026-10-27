export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

const API_BASE = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) || "/api";

export class ApiClient {

  private static getToken(): string | null {
    return localStorage.getItem("helartico_token");
  }

  public static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.error || "Request failed");
    }

    return data.data !== undefined ? data.data : data;
  }

  public static async requestPaginated<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PaginatedResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.error || "Request failed");
    }

    const items: T[] = Array.isArray(data.data) ? data.data : [];
    const pagination: PaginationMeta = data.pagination || {
      page: 1,
      limit: items.length,
      total: items.length,
      totalPages: 1,
      hasMore: false,
    };

    return { items, pagination };
  }


  public static async uploadImage(file: File): Promise<string> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append("image", file);

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.error || "Failed to upload image");
    }

    return data.data.url;
  }
}
