import { createHash } from "crypto";

const hash = (p) => createHash("sha256").update(p + "agentpack2026").digest("hex");
const makeToken = (id, email) => Buffer.from(`${id}:${email}:${Date.now()}`).toString("base64");

const USERS = [];

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const rawPath = event.path || "";
  const path = rawPath
    .replace("/.netlify/functions/api", "")
    .replace("/api", "")
    .replace(/\/$/, "") || "/";

  const method = event.httpMethod;
  const body = event.body ? JSON.parse(event.body) : {};

  console.log("PATH:", path, "METHOD:", method);

  if (path === "/health" || path === "/") {
    return { statusCode: 200, headers, body: JSON.stringify({ status: "ok", path }) };
  }

  if (path === "/auth/register" && method === "POST") {
    const { email, password, name } = body;
    if (!email || !password) return { statusCode: 400, headers, body: JSON.stringify({ error: "Email and password required" }) };
    if (password.length < 6) return { statusCode: 400, headers, body: JSON.stringify({ error: "Password min 6 characters" }) };
    if (USERS.find(u => u.email === email.toLowerCase())) {
      return { statusCode: 409, headers, body: JSON.stringify({ error: "Email already registered" }) };
    }
    const user = { id: Date.now(), email: email.toLowerCase(), passwordHash: hash(password), name: name || email.split("@")[0] };
    USERS.push(user);
    const token = makeToken(user.id, user.email);
    return { statusCode: 201, headers, body: JSON.stringify({ id: user.id, email: user.email, name: user.name, token }) };
  }

  if (path === "/auth/login" && method === "POST") {
    const { email, password } = body;
    const user = USERS.find(u => u.email === email?.toLowerCase());
    if (!user || user.passwordHash !== hash(password)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid email or password" }) };
    }
    const token = makeToken(user.id, user.email);
    return { statusCode: 200, headers, body: JSON.stringify({ id: user.id, email: user.email, name: user.name, token }) };
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found", path, method }) };
};
