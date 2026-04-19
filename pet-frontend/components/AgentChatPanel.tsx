"use client";

import { useState } from "react";
import { chatWithAgent } from "@/lib/api";

export function AgentChatPanel({ petId }: { petId: number }) {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("看看我家宠物今天状态怎么样，还有哪些任务没做？");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await chatWithAgent({ pet_id: petId, message: userText });
      setMessages((prev) => [...prev, { role: "assistant", text: result.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Agent 调用失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-2">
      <section className="card stack">
        <h2 className="section-title">Agent 对话</h2>
        <div className="chat-log">
          {messages.length === 0 ? <div className="empty">先试试问一句：“今天喂了 80g，帮我记一下。”</div> : null}
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
              {message.text}
            </div>
          ))}
        </div>
        {error ? <div className="small status-warn">{error}</div> : null}
      </section>

      <form className="card stack" onSubmit={onSubmit}>
        <h2 className="section-title">发送消息</h2>
        <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入你想让 Agent 做的事" />
        <button className="button" disabled={loading} type="submit">
          {loading ? "思考中..." : "发送给 Agent"}
        </button>
        <div className="small">
          适合测试的指令：
          <br />1. 今天给它喂了 85g 猫粮，喝水大概 120ml，帮我记一下。
          <br />2. 看看我家猫今天状态和任务。
          <br />3. 帮我完成任务 1。
        </div>
      </form>
    </div>
  );
}
