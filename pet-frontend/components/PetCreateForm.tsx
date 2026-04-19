"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPet, createVirtualPet } from "@/lib/api";

export function PetCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    species: "cat",
    breed: "",
    gender: "",
    weight_kg: 4,
    nickname: ""
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const pet = await createPet({
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        gender: form.gender || undefined,
        weight_kg: form.weight_kg || undefined,
        neutered: false
      });
      await createVirtualPet({
        pet_id: pet.id,
        nickname: form.nickname || `${pet.name}团子`,
        species_style: form.species === "dog" ? "default_dog" : "default_cat"
      });
      router.push(`/pets/${pet.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card stack" onSubmit={onSubmit}>
      <h2 className="section-title">创建宠物与电子宠物</h2>
      <label>
        <span className="label">名字</span>
        <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
      </label>
      <div className="row">
        <label style={{ flex: 1 }}>
          <span className="label">物种</span>
          <select className="select" value={form.species} onChange={(e) => setForm((p) => ({ ...p, species: e.target.value }))}>
            <option value="cat">猫</option>
            <option value="dog">狗</option>
            <option value="other">其他</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          <span className="label">品种</span>
          <input className="input" value={form.breed} onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))} />
        </label>
      </div>
      <div className="row">
        <label style={{ flex: 1 }}>
          <span className="label">性别</span>
          <input className="input" value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} />
        </label>
        <label style={{ flex: 1 }}>
          <span className="label">体重(kg)</span>
          <input className="input" type="number" min="0" step="0.1" value={form.weight_kg} onChange={(e) => setForm((p) => ({ ...p, weight_kg: Number(e.target.value) }))} />
        </label>
      </div>
      <label>
        <span className="label">电子宠物昵称</span>
        <input className="input" value={form.nickname} onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))} placeholder="留空会自动生成" />
      </label>
      {error ? <div className="small status-warn">{error}</div> : null}
      <button className="button" disabled={loading} type="submit">
        {loading ? "创建中..." : "创建并进入主页"}
      </button>
    </form>
  );
}
