"use client";

import { useState } from "react";

export default function CalculatorPage() {
  const [base, setBase] = useState("100");
  const [mult, setMult] = useState("1");
  const [def, setDef] = useState("0");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  function compute(e: React.FormEvent) {
    e.preventDefault();
    try {
      const b = Number(base), m = Number(mult), d = Number(def);
      if (!Number.isFinite(b) || !Number.isFinite(m) || !Number.isFinite(d)) throw new Error("invalid");
      if (b < 0 || m < 0 || d < 0) throw new Error("negative");
      const raw = b * m;
      const mitigated = raw * (1 - Math.min(d, 100) / 100);
      setResult(Math.max(0, Math.round(mitigated)));
      setError("");
    } catch {
      setError("Invalid input");
      setResult(null);
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Damage Calculator (Sample)</h1>
      <p className="text-muted mb-4">Sample calculator using generic inputs. Not live game data.</p>
      <form onSubmit={compute} className="space-y-3 max-w-md">
        <label className="block">Base damage
          <input value={base} onChange={(e) => setBase(e.target.value)} className="w-full border border-slate-700 bg-slate-900 px-3 py-2 rounded" />
        </label>
        <label className="block">Multiplier
          <input value={mult} onChange={(e) => setMult(e.target.value)} className="w-full border border-slate-700 bg-slate-900 px-3 py-2 rounded" />
        </label>
        <label className="block">Defense (0-100)
          <input value={def} onChange={(e) => setDef(e.target.value)} className="w-full border border-slate-700 bg-slate-900 px-3 py-2 rounded" />
        </label>
        <button type="submit" className="btn-primary">Calculate</button>
      </form>
      {error && <p className="text-red-400 mt-3">{error}</p>}
      {result !== null && <p className="mt-3 text-xl">Result: {result}</p>}
    </section>
  );
}
