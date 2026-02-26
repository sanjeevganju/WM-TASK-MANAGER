import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f8ee75b1/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== TREK MANAGEMENT ==========

// Get all treks
app.get("/make-server-f8ee75b1/treks", async (c) => {
  try {
    const treks = await kv.getByPrefix("trek:");
    return c.json({ treks: treks || [] });
  } catch (error) {
    console.error("Error fetching treks:", error);
    return c.json({ error: "Failed to fetch treks", details: String(error) }, 500);
  }
});

// Get a specific trek
app.get("/make-server-f8ee75b1/treks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const trek = await kv.get(`trek:${id}`);
    
    if (!trek) {
      return c.json({ error: "Trek not found" }, 404);
    }
    
    return c.json({ trek });
  } catch (error) {
    console.error("Error fetching trek:", error);
    return c.json({ error: "Failed to fetch trek", details: String(error) }, 500);
  }
});

// Create a new trek
app.post("/make-server-f8ee75b1/treks", async (c) => {
  try {
    const body = await c.req.json();
    const { name, startDate, endDate, numberOfClients, baseName } = body;
    
    if (!name || !startDate || !endDate || !numberOfClients || !baseName) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const id = crypto.randomUUID();
    const trek = {
      id,
      name,
      startDate,
      endDate,
      numberOfClients,
      baseName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`trek:${id}`, trek);
    return c.json({ trek }, 201);
  } catch (error) {
    console.error("Error creating trek:", error);
    return c.json({ error: "Failed to create trek", details: String(error) }, 500);
  }
});

// Update a trek
app.put("/make-server-f8ee75b1/treks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const existingTrek = await kv.get(`trek:${id}`);
    if (!existingTrek) {
      return c.json({ error: "Trek not found" }, 404);
    }
    
    const updatedTrek = {
      ...existingTrek,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`trek:${id}`, updatedTrek);
    return c.json({ trek: updatedTrek });
  } catch (error) {
    console.error("Error updating trek:", error);
    return c.json({ error: "Failed to update trek", details: String(error) }, 500);
  }
});

// Delete a trek
app.delete("/make-server-f8ee75b1/treks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const existingTrek = await kv.get(`trek:${id}`);
    if (!existingTrek) {
      return c.json({ error: "Trek not found" }, 404);
    }
    
    // Delete trek
    await kv.del(`trek:${id}`);
    
    // Delete all tasks for this trek
    const allTasks = await kv.getByPrefix(`task:${id}:`);
    const taskKeys = allTasks.map(task => `task:${id}:${task.taskTemplateId}`);
    if (taskKeys.length > 0) {
      await kv.mdel(taskKeys);
    }
    
    return c.json({ message: "Trek deleted successfully" });
  } catch (error) {
    console.error("Error deleting trek:", error);
    return c.json({ error: "Failed to delete trek", details: String(error) }, 500);
  }
});

// ========== TASK MANAGEMENT ==========

// Get all tasks for a trek
app.get("/make-server-f8ee75b1/treks/:trekId/tasks", async (c) => {
  try {
    const trekId = c.req.param("trekId");
    const tasks = await kv.getByPrefix(`task:${trekId}:`);
    return c.json({ tasks: tasks || [] });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return c.json({ error: "Failed to fetch tasks", details: String(error) }, 500);
  }
});

// Update a task
app.put("/make-server-f8ee75b1/treks/:trekId/tasks/:taskTemplateId", async (c) => {
  try {
    const trekId = c.req.param("trekId");
    const taskTemplateId = c.req.param("taskTemplateId");
    const body = await c.req.json();
    
    const taskKey = `task:${trekId}:${taskTemplateId}`;
    const existingTask = await kv.get(taskKey);
    
    const updatedTask = {
      ...existingTask,
      ...body,
      trekId,
      taskTemplateId,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(taskKey, updatedTask);
    return c.json({ task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return c.json({ error: "Failed to update task", details: String(error) }, 500);
  }
});

// Bulk update tasks
app.post("/make-server-f8ee75b1/treks/:trekId/tasks/bulk", async (c) => {
  try {
    const trekId = c.req.param("trekId");
    const body = await c.req.json();
    const { tasks } = body;
    
    if (!Array.isArray(tasks)) {
      return c.json({ error: "Tasks must be an array" }, 400);
    }
    
    // Update all tasks
    const updates = tasks.map(task => {
      const taskKey = `task:${trekId}:${task.id}`;
      return kv.set(taskKey, {
        ...task,
        trekId,
        taskTemplateId: task.id,
        updatedAt: new Date().toISOString()
      });
    });
    
    await Promise.all(updates);
    
    return c.json({ message: "Tasks updated successfully", count: tasks.length });
  } catch (error) {
    console.error("Error bulk updating tasks:", error);
    return c.json({ error: "Failed to bulk update tasks", details: String(error) }, 500);
  }
});

// ========== STAFF MANAGEMENT ==========

// Get staff database
app.get("/make-server-f8ee75b1/staff", async (c) => {
  try {
    const staff = await kv.get("staff:database");
    
    if (!staff) {
      // Return default staff if none exists
      const defaultStaff = {
        tripLeaders: ['Rajesh Kumar', 'Amit Singh', 'Priya Sharma', 'Deepak Verma', 'Neha Patel'],
        cooks: ['Ramesh Bisht', 'Suresh Negi', 'Kailash Thapa', 'Mohan Rawat', 'Dinesh Kumar'],
        assistantGuides: ['Vijay Singh', 'Sonam Dorje', 'Tashi Namgyal', 'Karma Wangdi', 'Lobsang Dorji', 'Rinchen Dorji'],
        supportStaff: ['Raju Lal', 'Shankar Prasad', 'Bhim Bahadur', 'Jeet Singh', 'Narender Kumar', 'Prakash Rai']
      };
      await kv.set("staff:database", defaultStaff);
      return c.json({ staff: defaultStaff });
    }
    
    return c.json({ staff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return c.json({ error: "Failed to fetch staff", details: String(error) }, 500);
  }
});

// Update staff database
app.put("/make-server-f8ee75b1/staff", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("staff:database", body);
    return c.json({ staff: body });
  } catch (error) {
    console.error("Error updating staff:", error);
    return c.json({ error: "Failed to update staff", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);