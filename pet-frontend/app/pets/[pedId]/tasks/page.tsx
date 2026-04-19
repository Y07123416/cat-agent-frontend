import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { TaskPanel } from "@/components/TaskPanel";
import { getDashboard } from "@/lib/api";

export default async function PetTasksPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const dashboard = await getDashboard(Number(petId)).catch(() => null);

  if (!dashboard) notFound();

  return (
    <main className="page stack">
      <PageHeader
        petId={dashboard.pet.id}
        title={`${dashboard.pet.name} 的任务页`}
        subtitle="把任务创建、完成领奖励、驱动电子宠物成长这条链先做出来。"
        active="tasks"
      />
      <TaskPanel petId={dashboard.pet.id} tasks={dashboard.tasks} />
    </main>
  );
}
