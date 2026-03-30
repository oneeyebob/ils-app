"use client";

import { useState } from "react";

type Task = {
  opgave: string;
  hjaelp: string;
  mere_hjaelp: string;
};

export default function Home() {
  const [strength, setStrength] = useState("");
  const [weakness, setWeakness] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState({ hjaelp: false, mere_hjaelp: false });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTask(null);
    setError("");
    setRevealed({ hjaelp: false, mere_hjaelp: false });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strength, weakness, grade }),
      });

      if (!res.ok) throw new Error("Noget gik galt");
      const data = await res.json();
      setTask(data);
    } catch {
      setError("Kunne ikke generere opgave. Prøv igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ILS</h1>
          <p className="text-slate-500 mt-1 text-sm">Intuitive Learning System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Elevens styrke
            </label>
            <input
              type="text"
              placeholder="fx historie, fodbold, tegning..."
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Elevens svaghed
            </label>
            <input
              type="text"
              placeholder="fx matematik, læsning, grammatik..."
              value={weakness}
              onChange={(e) => setWeakness(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Alderstrin
            </label>
            <input
              type="text"
              placeholder="fx 3. klasse, 7. klasse..."
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Genererer opgave..." : "Generer opgave"}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-sm text-red-600">{error}</p>
        )}

        {task && (
          <div className="mt-10 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Opgave</p>
              <p className="text-slate-900 text-base leading-relaxed">{task.opgave}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setRevealed((r) => ({ ...r, hjaelp: !r.hjaelp }))}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700">Hjælp</span>
                <span className="text-slate-400 text-lg">{revealed.hjaelp ? "−" : "+"}</span>
              </button>
              {revealed.hjaelp && (
                <div className="px-6 pb-5 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                  {task.hjaelp}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setRevealed((r) => ({ ...r, mere_hjaelp: !r.mere_hjaelp }))}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700">Mere hjælp</span>
                <span className="text-slate-400 text-lg">{revealed.mere_hjaelp ? "−" : "+"}</span>
              </button>
              {revealed.mere_hjaelp && (
                <div className="px-6 pb-5 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                  {task.mere_hjaelp}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
