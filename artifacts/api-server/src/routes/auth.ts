import { Router, type IRouter } from "express";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";

const router: IRouter = Router();
const DB_FILE = "/tmp/agentpack-users.json";

const loadUsers = (): any[] => {
  try {
    if (!existsSync(DB_FILE)) return [];
    return JSON.parse(readFileSync(DB_FILE, "utf8"));
  } catch { return []; }
};

const saveUsers = (users: any[]) => {
  writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

const hashPassword = (password: string) =>
  createHash("sha256").update(password + "agentpack_salt_2026").digest("hex");

const makeToken = (id: number, email: string) =>
  Buffer.from(`${id}:${email}`).toString("base64");

router.post("/auth/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) { res.status(400).json({ error: "Email and password are required" }); return; }
  if (password.length < 6) { res.status(400).json({ error: "Password must be at least 6 characters" }); return; }
  
  const users = loadUsers();
  if (users.find((u: any) => u.email === email)) {
    res.status(409).json({ error: "Email already registered" }); return;
  }
  
  const newUser = {
    id: Date.now(),
    email,
    passwordHash: hashPassword(password),
    name: name || email.split("@")[0],
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  const token = makeToken(newUser.id, email);
  res.status(201).json({ id: newUser.id, email, name: newUser.name, token });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: "Email and password are required" }); return; }
  
  const users = loadUsers();
  const user = users.find((u: any) => u.email === email);
  
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid email or password" }); return;
  }
  
  const token = makeToken(user.id, email);
  res.json({ id: user.id, email: user.email, name: user.name, token });
});

export default router;
