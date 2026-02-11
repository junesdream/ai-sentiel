"use client";
import { useState, useEffect, useRef } from "react";
import { askAI } from "./actions";

export default function Home() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix Regen Effekt
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#10b981";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setAnswer("");
    const result = await askAI(input);
    setAnswer(result || "Keine Antwort erhalten.");
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-black text-emerald-500 font-mono flex items-center justify-center p-4">
      {/* Matrix Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-2xl z-10 bg-black/60 backdrop-blur-md border border-emerald-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="mb-8 flex items-center justify-between border-b border-emerald-900/50 pb-4">
          <h1 className="text-2xl font-black tracking-widest italic flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            AI-SENTINEL
          </h1>
          <span className="text-[10px] text-emerald-800 uppercase tracking-[0.3em]">Node_Connected</span>
        </div>

        <div className="bg-black/40 border border-emerald-500/10 rounded-xl p-6 min-h-[350px] mb-8 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex gap-2 animate-pulse text-emerald-300 italic">
              {">"} ACCESSING_CORE_DATA...
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {answer ? `> ${answer}` : "> SYSTEM READY. ENTER COMMAND."}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            className="flex-1 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 outline-none focus:border-emerald-500/50 transition-all text-sm"
            placeholder="System-Anfrage eingeben..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-emerald-500 text-black px-8 py-4 rounded-xl font-black hover:bg-emerald-400 active:scale-95 transition-all text-xs tracking-widest">
            EXECUTE
          </button>
        </form>
      </div>
    </main>
  );
}