import client from "./client";

const TOKEN_KEY = "access_token";

export async function signup(payload) {
  const response = await client.post("/auth/signup", payload);
  return response.data;
}

export async function login(payload) {
  const response = await client.post("/auth/login", payload);

  const token = response.data.access_token;
  localStorage.setItem(TOKEN_KEY, token);

  return response.data;
}

export async function getMe() {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await client.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}