// ─── API Configuration ────────────────────────────────────────────────────────
export const API_BASE = "http://localhost:8080";

// ─── Token Helpers ────────────────────────────────────────────────────────────
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const setUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  }
  return null;
};

// ─── Authenticated Fetch ──────────────────────────────────────────────────────
/**
 * apiFetch — wraps native fetch with:
 *   - Base URL prepended
 *   - Authorization: Bearer <token> header (if token present)
 *   - JSON Content-Type by default
 *   - Throws on non-2xx responses with parsed error message
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const err = await res.json();
      message = err.message || err.error || message;
    } catch (_) {}
    throw new Error(message);
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  return res.json();
}
