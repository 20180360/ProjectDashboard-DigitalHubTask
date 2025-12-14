export const API_BASE = "http://localhost:5000";

export async function apiRequest(path: string, options:RequestInit = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

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
    throw new Error("API Error");
  }

  return res.json();
  
}
export function loginUser(email: string, password: string) {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

