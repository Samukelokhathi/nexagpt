import { useEffect, useRef, useState } from "react";
import "./App.css";

type Message = { role: "user" | "ai"; text: string };
type Theme = "dark" | "light";

const MODEL = "llama3.2"; // change to a <1GB model later
const USER_NAME = "Your Name"; // put your name here
const SYSTEM_PROMPT = `You are NexaGPT, a helpful AI assistant helping ${USER_NAME}. Keep answers clear and concise.`;
const OLLAMA_URL = "http://localhost:11434/api/generate";

const SUGGESTIONS = [
  "Write a to-do list for my day",
  "Explain contrast in UI design",
  "Give me 5 startup name ideas",
];

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark"
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const prompt = (text ?? input).trim();
    if (!prompt || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          system: SYSTEM_PROMPT,
          prompt,
          stream: false,
        }),
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
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/nexagpt-logo.jpg" alt="NexaGPT logo" className="logo" />
          <span>NexaGPT</span>
        </div>

        <button className="new-chat" onClick={() => setMessages([])}>
          + New Chat
        </button>

        <div className="sidebar-spacer" />

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
        </button>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="messages">
          {messages.length === 0 && !loading ? (
            <div className="welcome">
              <img src="/nexagpt-logo.jpg" alt="" className="welcome-logo" />
              <p className="welcome-sub">Welcome to NexaGPT</p>
              <h2 className="welcome-title">How Can I Assist You?</h2>
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="card" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat">
              {messages.map((m, i) => (
                <div key={i} className={`bubble ${m.role}`}>
                  {m.text}
                </div>
              ))}
              {loading && <div className="spinner" />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="input-wrap">
          <div className="input-bar">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask AI anything or write your request..."
            />
            <button onClick={() => send()} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}