import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PetCreateForm } from "@/components/PetCreateForm";
import { listPets } from "@/lib/api";

export default async function PetsPage() {
  const pets = await listPets().catch(() => []);

  return (
    <main className="page stack">
      <PageHeader
        title="宠物平台关键页面"
        subtitle="先把可演示的几页做出来：宠物列表/创建、首页 Dashboard、记录页、任务页、Agent 对话页。"
        active="pets"
      />

      <div className="grid grid-2">
        <PetCreateForm />

        <section className="card stack">
          <h2 className="section-title">已有宠物</h2>
          {pets.length === 0 ? <div className="empty">还没有宠物，先在左边创建一只。</div> : null}
          <ul className="list">
            {pets.map((pet) => (
              <li key={pet.id} className="list-item">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="stack" style={{ flex: 1 }}>
                    <strong>{pet.name}</strong>
                    <span className="small">{pet.species}{pet.breed ? ` · ${pet.breed}` : ""}</span>
                  </div>
                  <Link className="button inline" href={`/pets/${pet.id}`}>
                    进入主页
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
