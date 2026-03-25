import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { spawn } from "child_process";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", async (req, res) => {
    // Simulate checking Paraguayan civic data APIs
    const services = [
      { name: "SET/DNIT", status: "online", latency: "45ms" },
      { name: "Congreso", status: "online", latency: "120ms" },
      { name: "Hacienda", status: "online", latency: "30ms" },
      { name: "IPS", status: "online", latency: "80ms" },
      { name: "TSJE", status: "online", latency: "65ms" },
      { name: "Gemini AI", status: process.env.GEMINI_API_KEY ? "online" : "offline", latency: "N/A" }
    ];
    
    const allOnline = services.every(s => s.status === "online");
    res.json({ status: allOnline ? "ok" : "degraded", services });
  });

  app.post("/api/search", async (req, res) => {
    const { query } = req.body;
    
    try {
      // Execute the Python script
      const pythonProcess = spawn("python3", ["backend/omni_pipeline.py", query]);
      
      let stdoutData = "";
      let stderrData = "";

      pythonProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
        // We could potentially stream these logs to the frontend
        console.log(`[Python Agent Log]: ${data.toString().trim()}`);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
          return res.status(500).json({ error: "An error occurred during the investigation." });
        }

        try {
          // The last line of stdout should be the JSON
          const lines = stdoutData.trim().split('\n');
          const jsonStr = lines[lines.length - 1];
          const profileData = JSON.parse(jsonStr);
          res.json({ status: "success", profile: profileData });
        } catch (e) {
          console.error("Failed to parse Python output:", e);
          console.error("Raw output:", stdoutData);
          res.status(500).json({ error: "Failed to parse investigation results." });
        }
      });
    } catch (error: any) {
      console.error("OSINT Search Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during the investigation." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
