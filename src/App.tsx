import { useState } from "react";
import "./App.css";

type Message = { role: "user" | "ai"; text: string };

const MODEL = "llama3.2"; // change to a <1GB model later
const OLLAMA_URL = "http://localhost:11434/api/generate";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const prompt = input.trim();
    if (!prompt || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt, stream: false }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Could not reach Ollama. Is it running?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src="/nexagpt-logo.jpg" alt="NexaGPT logo" className="logo" />
        <h1>NexaGPT</h1>
      </header>

      <div className="messages">
        {messages.length === 0 && !loading && (
          <div className="empty">
            <img src="/nexagpt-logo.jpg" alt="" className="empty-logo" />
            <p>How can I help you today?</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}

        {loading && <div className="spinner" />}
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
        />
        <button onClick={send} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}