import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { RecordForm } from "@/components/RecordForm";
import { getDashboard } from "@/lib/api";

export default async function PetRecordsPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const dashboard = await getDashboard(Number(petId)).catch(() => null);

  if (!dashboard) notFound();

  return (
    <main className="page stack">
      <PageHeader
        petId={dashboard.pet.id}
        title={`${dashboard.pet.name} 的记录页`}
        subtitle="先把 today upsert 跑通：喂食、饮水、活动、食欲、精神、便便和备注都能落库。"
        active="records"
      />

      <div className="grid grid-2">
        <RecordForm petId={dashboard.pet.id} initialRecord={dashboard.today_record} />

        <section className="card stack">
          <h2 className="section-title">当前记录预览</h2>
          {dashboard.today_record ? (
            <dl className="kv">
              <div><dt>日期</dt><dd>{dashboard.today_record.record_date}</dd></div>
              <div><dt>喂食</dt><dd>{dashboard.today_record.food_amount_g ?? 0} g</dd></div>
              <div><dt>饮水</dt><dd>{dashboard.today_record.water_ml ?? 0} ml</dd></div>
              <div><dt>活动</dt><dd>{dashboard.today_record.activity_minutes ?? 0} min</dd></div>
              <div><dt>食欲</dt><dd>{dashboard.today_record.appetite_score}</dd></div>
              <div><dt>精神</dt><dd>{dashboard.today_record.energy_score}</dd></div>
              <div><dt>便便</dt><dd>{dashboard.today_record.poop_status || "-"}</dd></div>
              <div><dt>心情</dt><dd>{dashboard.today_record.mood || "-"}</dd></div>
            </dl>
          ) : <div className="empty">今天还没有记录，左边表单保存后这里会刷新。</div>}
        </section>
      </div>
    </main>
  );
}
