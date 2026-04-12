import { Router, type IRouter } from "express";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const router: IRouter = Router();
const DB_DIR = "/tmp/agentpack";
const DB_FILE = path.join(DB_DIR, "users.json");

if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const loadUsers = (): any[] => {
  try {
    if (!existsSync(DB_FILE)) return [];
    return JSON.parse(readFileSync(DB_FILE, "utf8"));
  } catch { return []; }
};

const saveUsers = (users: any[]) => {
  writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

const hash = (password: string) =>
  createHash("sha256").update(password + "agentpack2026").digest("hex");

const makeToken = (id: number, email: string) =>
  Buffer.from(`${id}:${email}:${Date.now()}`).toString("base64");

router.post("/auth/register", (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) { res.status(400).json({ error: "Email and password are required" }); return; }
    if (password.length < 6) { res.status(400).json({ error: "Password must be at least 6 characters" }); return; }
    const users = loadUsers();
    if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      res.status(409).json({ error: "Email already registered. Please sign in." }); return;
    }
    const newUser = { id: Date.now(), email: email.toLowerCase(), passwordHash: hash(password), name: name || email.split("@")[0], createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);
    const token = makeToken(newUser.id, newUser.email);
    res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

router.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "Email and password are required" }); return; }
    const users = loadUsers();
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== hash(password)) {
      res.status(401).json({ error: "Invalid email or password" }); return;
    }
    const token = makeToken(user.id, user.email);
    res.json({ id: user.id, email: user.email, name: user.name, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

router.get("/auth/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
    const token = authHeader.split(" ")[1];
    const decoded = Buffer.from(token, "base64").toString();
    const [id, email] = decoded.split(":");
    const users = loadUsers();
    const user = users.find((u: any) => u.email === email);
    if (!user) { res.status(401).json({ error: "User not found" }); return; }
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
