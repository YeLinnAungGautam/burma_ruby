// Client-side auth utilities
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
}

export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
  }
}

export function isAuthenticated() {
  return !!getToken();
}
