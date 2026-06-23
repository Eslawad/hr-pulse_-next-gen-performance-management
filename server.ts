import express from "express";
import path from "path";
import compression from "compression";
import { createServer as createViteServer } from "vite";

// --- IN-MEMORY DATABASE (HACKATHON SPEED) ---
const DB = {
  users: [
    { uid: "admin-1", name: "System Admin", email: "admin@hrpulse.com", role: "admin" },
    { uid: "manager-1", name: "Sarah Manager", email: "sarah@hrpulse.com", role: "manager" },
    { uid: "emp-1", name: "John Employee", email: "john@hrpulse.com", role: "employee", managerId: "manager-1" },
  ],
  goals: [] as any[],
  auditLogs: [] as any[],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(compression());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // --- AUTH API ---
  app.post("/api/auth/login", (req, res) => {
    // Basic mock login - in a real app, this would verify JWT/Session
    const { email } = req.body;
    let user = DB.users.find(u => u.email === email);
    
    if (!user) {
      // Auto-register for demo purposes if not found
      user = { 
        uid: `user-${Date.now()}`, 
        name: email.split('@')[0], 
        email, 
        role: 'employee',
        managerId: 'manager-1'
      };
      DB.users.push(user);
    }
    res.json(user);
  });

  app.get("/api/users/me", (req, res) => {
    // Mock getting current user from session/header
    res.json(DB.users[2]); // Return John Employee by default for demo
  });

  // --- GOALS API ---
  app.get("/api/goals", (req, res) => {
    const { userId } = req.query;
    const goals = userId 
      ? DB.goals.filter(g => g.employeeId === userId) 
      : DB.goals;
    res.json(goals);
  });

  app.get("/api/goals/team", (req, res) => {
    const { managerId } = req.query;
    const teamUids = DB.users.filter(u => u.managerId === managerId).map(u => u.uid);
    const goals = DB.goals.filter(g => teamUids.includes(g.employeeId));
    res.json(goals);
  });

  app.post("/api/goals", (req, res) => {
    const newGoal = {
      ...req.body,
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: 'draft',
      isLocked: false,
      createdAt: new Date().toISOString(),
    };
    DB.goals.push(newGoal);
    
    DB.auditLogs.push({
      id: `log-${Date.now()}`,
      action: "GOAL_CREATED",
      userId: newGoal.employeeId,
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json(newGoal);
  });

  app.patch("/api/goals/:id", (req, res) => {
    const { id } = req.params;
    const index = DB.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      DB.goals[index] = { ...DB.goals[index], ...req.body, updatedAt: new Date().toISOString() };
      
      DB.auditLogs.push({
        id: `log-${Date.now()}`,
        action: `GOAL_UPDATED_${req.body.status || 'CONTENT'}`,
        userId: "system",
        timestamp: new Date().toISOString()
      });
      
      res.json(DB.goals[index]);
    } else {
      res.status(404).json({ error: "Goal not found" });
    }
  });

  app.post("/api/goals/batch-update", (req, res) => {
    const { ids, updates } = req.body;
    ids.forEach((id: string) => {
      const index = DB.goals.findIndex(g => g.id === id);
      if (index !== -1) {
        DB.goals[index] = { ...DB.goals[index], ...updates, updatedAt: new Date().toISOString() };
      }
    });
    
    DB.auditLogs.push({
      id: `log-${Date.now()}`,
      action: "GOALS_BATCH_UPDATED",
      userId: "system",
      timestamp: new Date().toISOString()
    });
    
    res.json({ success: true, count: ids.length });
  });

  // --- AUDIT LOGS ---
  app.get("/api/admin/audit-logs", (req, res) => {
    res.json(DB.auditLogs.slice(-20).reverse());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HR Pulse Server running on http://localhost:${PORT}`);
  });
}

startServer();
