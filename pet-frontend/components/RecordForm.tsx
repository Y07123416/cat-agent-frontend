"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DailyRecord, upsertDailyRecord } from "@/lib/api";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function RecordForm({ petId, initialRecord }: { petId: number; initialRecord: DailyRecord | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    record_date: initialRecord?.record_date ?? today(),
    food_amount_g: initialRecord?.food_amount_g ?? 80,
    water_ml: initialRecord?.water_ml ?? 120,
    activity_minutes: initialRecord?.activity_minutes ?? 30,
    appetite_score: initialRecord?.appetite_score ?? 3,
    energy_score: initialRecord?.energy_score ?? 3,
    poop_status: initialRecord?.poop_status ?? "normal",
    mood: initialRecord?.mood ?? "happy",
    notes: initialRecord?.notes ?? ""
  });

  const title = useMemo(() => (initialRecord ? "更新今日记录" : "新增今日记录"), [initialRecord]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await upsertDailyRecord({ pet_id: petId, ...form });
      setMessage(result.message);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h2 className="section-title">{title}</h2>
      <div className="row">
        <label style={{ flex: 1 }}>
          <span className="label">日期</span>
          <input className="input" type="date" value={form.record_date} onChange={(e) => setForm((p) => ({ ...p, record_date: e.target.value }))} />
        </label>
        <label style={{ flex: 1 }}>
          <span className="label">喂食(g)</span>
          <input className="input" type="number" value={form.food_amount_g ?? 0} onChange={(e) => setForm((p) => ({ ...p, food_amount_g: Number(e.target.value) }))} />
        </label>
      </div>
      <div className="row">
        <label style={{ flex: 1 }}>
          <span className="label">饮水(ml)</span>
          <input className="input" type="number" value={form.water_ml ?? 0} onChange={(e) => setForm((p) => ({ ...p, water_ml: Number(e.target.value) }))} />
        </label>
        <label style={{ flex: 1 }}>
          <span className="label">活动(分钟)</span>
          <input className="input" type="number" value={form.activity_minutes ?? 0} onChange={(e) => setForm((p) => ({ ...p, activity_minutes: Number(e.target.value) }))} />
        </label>
      </div>
      <div className="row">
        <label style={{ flex: 1 }}>
          <span className="label">食欲评分</span>
          <select className="select" value={form.appetite_score} onChange={(e) => setForm((p) => ({ ...p, appetite_score: Number(e.target.value) }))}>
            {[1, 2, 3, 4, 5].map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
        <label style={{ flex: 1 }}>
          <span className="label">精神评分</span>
          <select className="select" value={form.energy_score} onChange={(e) => setForm((p) => ({ ...p, energy_score: Number(e.target.value) }))}>
            {[1, 2, 3, 4, 5].map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
      </div>
      <div className="row">
        <label style={{ flex: 1 }}>
          <span className="label">便便状态</span>
          <select className="select" value={form.poop_status ?? "normal"} onChange={(e) => setForm((p) => ({ ...p, poop_status: e.target.value }))}>
            <option value="normal">normal</option>
            <option value="soft">soft</option>
            <option value="hard">hard</option>
            <option value="none">none</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          <span className="label">心情</span>
          <select className="select" value={form.mood ?? "normal"} onChange={(e) => setForm((p) => ({ ...p, mood: e.target.value }))}>
            <option value="happy">happy</option>
            <option value="normal">normal</option>
            <option value="tired">tired</option>
            <option value="anxious">anxious</option>
          </select>
        </label>
      </div>
      <label>
        <span className="label">备注</span>
        <textarea className="textarea" value={form.notes ?? ""} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
      </label>
      {message ? <div className="small status-ok">{message}</div> : null}
      {error ? <div className="small status-warn">{error}</div> : null}
      <button className="button" disabled={loading} type="submit">{loading ? "保存中..." : "保存记录"}</button>
    </form>
  );
}
