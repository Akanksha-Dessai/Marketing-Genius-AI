import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.id
                ? "bg-violet-600/30 text-violet-200"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  );
}
