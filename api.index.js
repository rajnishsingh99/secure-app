// api/index.js
// Simple Vercel serverless proxy that forwards requests to your Apps Script
// It reads the Apps Script URL from an environment variable SCRIPT_URL
import fetch from "node-fetch";

export default async function (req, res) {
  try {
    const scriptURL = process.env.SCRIPT_URL;
    if (!scriptURL) {
      return res.status(500).json({ error: "SCRIPT_URL not configured on server." });
    }

    const options = {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body || {}),
    };

    const r = await fetch(scriptURL, options);
    const text = await r.text();
    // try to parse JSON
    try {
      const j = JSON.parse(text);
      res.status(r.status).json(j);
    } catch (e) {
      // not JSON, send as text
      res.status(r.status).send(text);
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: String(err) });
  }
}
