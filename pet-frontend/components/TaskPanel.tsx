"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Task, completeTask, createTask } from "@/lib/api";

export function TaskPanel({ petId, tasks }: { petId: number; tasks: Task[] }) {
  const router = useRouter();
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "记录今天喂食",
    description: "完成一次真实养宠动作并领奖励",
    task_type: "feed",
    reward_xp: 20,
    reward_coins: 10
  });

  async function onCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await createTask({ pet_id: petId, ...form });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建任务失败");
    } finally {
      setCreating(false);
    }
  }

  async function onComplete(taskId: number) {
    setLoadingTaskId(taskId);
    setError(null);
    try {
      await completeTask(taskId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "完成任务失败");
    } finally {
      setLoadingTaskId(null);
    }
  }

  return (
    <div className="grid grid-2">
      <section className="card stack">
        <h2 className="section-title">今日任务</h2>
        {tasks.length === 0 ? <div className="empty">还没有任务，先创建一个默认任务。</div> : null}
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className={`list-item ${task.is_completed ? "done" : ""}`}>
              <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="stack" style={{ flex: 1 }}>
                  <strong>{task.title}</strong>
                  <span className="small">{task.description || "无描述"}</span>
                  <div className="row">
                    <span className="badge">{task.task_type}</span>
                    <span className="badge">+{task.reward_xp} XP</span>
                    <span className="badge">+{task.reward_coins} coins</span>
                  </div>
                </div>
                <button
                  className="button inline"
                  disabled={task.is_completed || loadingTaskId === task.id}
                  onClick={() => onComplete(task.id)}
                  type="button"
                >
                  {task.is_completed ? "已完成" : loadingTaskId === task.id ? "处理中..." : "完成任务"}
                </button>
              </div>
            </li>
          ))}
        </ul>
        {error ? <div className="small status-warn">{error}</div> : null}
      </section>

      <form className="card stack" onSubmit={onCreate}>
        <h2 className="section-title">新建任务</h2>
        <label>
          <span className="label">标题</span>
          <input className="input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        </label>
        <label>
          <span className="label">描述</span>
          <textarea className="textarea" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        </label>
        <div className="row">
          <label style={{ flex: 1 }}>
            <span className="label">类型</span>
            <select className="select" value={form.task_type} onChange={(e) => setForm((p) => ({ ...p, task_type: e.target.value }))}>
              <option value="feed">feed</option>
              <option value="water">water</option>
              <option value="walk">walk</option>
              <option value="health">health</option>
              <option value="custom">custom</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            <span className="label">XP</span>
            <input className="input" type="number" value={form.reward_xp} onChange={(e) => setForm((p) => ({ ...p, reward_xp: Number(e.target.value) }))} />
          </label>
          <label style={{ flex: 1 }}>
            <span className="label">Coins</span>
            <input className="input" type="number" value={form.reward_coins} onChange={(e) => setForm((p) => ({ ...p, reward_coins: Number(e.target.value) }))} />
          </label>
        </div>
        <button className="button" disabled={creating} type="submit">{creating ? "创建中..." : "创建任务"}</button>
      </form>
    </div>
  );
}
