import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { AgentChatPanel } from "@/components/AgentChatPanel";
import { getDashboard } from "@/lib/api";

export default async function PetAssistantPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const dashboard = await getDashboard(Number(petId)).catch(() => null);

  if (!dashboard) notFound();

  return (
    <main className="page stack">
      <PageHeader
        petId={dashboard.pet.id}
        title={`${dashboard.pet.name} 的 Agent 页`}
        subtitle="这一页先承接两类核心能力：查状态/任务，以及自然语言记录保存。"
        active="assistant"
      />
      <AgentChatPanel petId={dashboard.pet.id} />
    </main>
  );
}
