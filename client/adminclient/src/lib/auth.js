// Token is written by pages/auth/login.jsx — localStorage when "remember me"
// is checked, sessionStorage otherwise. Read both, in that order.
export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

// Decodes the JWT payload signed in server/routes/authRoute.js: { name, email, role }.
// Returns null for a missing, malformed, or expired token. This is for rendering
// decisions only — the server must still verify the signature on every request.
export function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function clearToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}
