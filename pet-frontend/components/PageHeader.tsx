import Link from "next/link";

export function PageHeader({
  petId,
  title,
  subtitle,
  active
}: {
  petId?: number;
  title: string;
  subtitle: string;
  active?: "pets" | "dashboard" | "records" | "tasks" | "assistant";
}) {
  const tabs = petId
    ? [
        { key: "dashboard", href: `/pets/${petId}`, label: "首页" },
        { key: "records", href: `/pets/${petId}/records`, label: "记录" },
        { key: "tasks", href: `/pets/${petId}/tasks`, label: "任务" },
        { key: "assistant", href: `/pets/${petId}/assistant`, label: "Agent" }
      ]
    : [{ key: "pets", href: "/pets", label: "宠物列表" }];

  return (
    <section className="hero">
      <div className="badge">Pet OS Frontend</div>
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>
      <nav className="nav">
        {tabs.map((tab) => (
          <Link key={tab.key} href={tab.href} className={tab.key === active ? "active" : ""}>
            {tab.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
