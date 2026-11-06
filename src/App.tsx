import { useEffect, useRef, useState } from "react";
import "./App.css";

type Message = {
  role: "user" | "ai";
  text: string;
  duration?: number; 
  tps?: number; 
};
type Theme = "dark" | "light";

const MODEL = "gemma3:1b"; 
const OLLAMA_URL = "http://localhost:11434/api/generate";
const STORAGE_KEY = "nexagpt-messages";
const USER_NAME = "Sam";
const SYSTEM_PROMPT = `You are NexaGPT, a helpful AI assistant.
The user you are talking to is named ${USER_NAME}. Their name is ${USER_NAME}.
If they ask who they are or what their name is, answer: "You are ${USER_NAME}."
Address them as ${USER_NAME} when it feels natural. Keep answers clear and concise.`;
const SUGGESTIONS = [
  "Write a to-do list for my day",
  "Explain contrast in UI design",
  "Give me 5 startup name ideas",
];

function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark"
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

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

      // Ollama durations are in nanoseconds
      const duration = data.total_duration / 1e9;
      const tps = data.eval_count / (data.eval_duration / 1e9);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.response, duration, tps },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Could not reach Ollama. Is it running?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([]); // the effect above also clears localStorage
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/nexagpt-logo.jpg" alt="NexaGPT logo" className="logo" />
          <span>NexaGPT</span>
        </div>

        <button className="new-chat" onClick={newChat}>
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
                <div key={i} className={`bubble-wrap ${m.role}`}>
                  <div className={`bubble ${m.role}`}>{m.text}</div>
                  {m.role === "ai" && m.duration !== undefined && (
                    <div className="stats">
                      ⏱ {m.duration.toFixed(2)}s · ⚡ {m.tps?.toFixed(1)} tokens/sec
                    </div>
                  )}
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