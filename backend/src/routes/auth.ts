import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { User, Profile } from "../models";
import { generateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, name, authProvider: "email" });
    await Profile.create({ userId: user.id });

    const token = generateToken(user.id);
    return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/google", async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, googleId } = req.body;
    if (!googleId) return res.status(400).json({ error: "googleId required" });

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ email, name, googleId, authProvider: "google" });
      await Profile.create({ userId: user.id });
    }

    const token = generateToken(user.id);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/apple", async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, appleId } = req.body;
    if (!appleId) return res.status(400).json({ error: "appleId required" });

    let user = await User.findOne({ appleId });
    if (!user) {
      user = await User.create({ email, name: name || "User", appleId, authProvider: "apple" });
      await Profile.create({ userId: user.id });
    }

    const token = generateToken(user.id);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/me", async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
