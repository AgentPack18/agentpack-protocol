import { createHash } from "crypto";

const hash = (password) =>
  createHash("sha256").update(password + "agentpack2026").digest("hex");

const makeToken = (id, email) =>
  Buffer.from(`${id}:${email}:${Date.now()}`).toString("base64");

// Simple in-memory store (gunakan environment variable untuk persist)
const getUsers = () => {
  try {
    return JSON.parse(process.env.USERS_DB || "[]");
  } catch { return []; }
};

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const path = event.path.replace("/.netlify/functions/api", "").replace("/api", "");
  const body = event.body ? JSON.parse(event.body) : {};

  // Health check
  if (path === "/health" || path === "") {
    return { statusCode: 200, headers, body: JSON.stringify({ status: "ok" }) };
  }

  // Register
  if (path === "/auth/register" && event.httpMethod === "POST") {
    const { email, password, name } = body;
    if (!email || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Email and password are required" }) };
    }
    if (password.length < 6) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Password must be at least 6 characters" }) };
    }
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { statusCode: 409, headers, body: JSON.stringify({ error: "Email already registered. Please sign in." }) };
    }
    const newUser = {
      id: Date.now(),
      email: email.toLowerCase(),
      passwordHash: hash(password),
      name: name || email.split("@")[0],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    const token = makeToken(newUser.id, newUser.email);
    return {
      statusCode: 201, headers,
      body: JSON.stringify({ id: newUser.id, email: newUser.email, name: newUser.name, token })
    };
  }

  // Login
  if (path === "/auth/login" && event.httpMethod === "POST") {
    const { email, password } = body;
    if (!email || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Email and password are required" }) };
    }
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== hash(password)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid email or password" }) };
    }
    const token = makeToken(user.id, user.email);
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ id: user.id, email: user.email, name: user.name, token })
    };
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
};
