import {
  Search,
  Target,
  PenTool,
  BarChart3,
  CheckCircle2,
  Loader2,
  Circle,
} from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import type { AgentState } from "../types/campaign";

interface AgentPipelineProps {
  agents: AgentState[];
  isGenerating: boolean;
}

const ICONS = {
  research: Search,
  strategy: Target,
  content: PenTool,
  analytics: BarChart3,
};

const STATUS_BADGE = {
  pending: { label: "Waiting", variant: "default" as const },
  running: { label: "Running", variant: "info" as const },
  complete: { label: "Complete", variant: "success" as const },
  error: { label: "Error", variant: "warning" as const },
};

export function AgentPipeline({ agents, isGenerating }: AgentPipelineProps) {
  const showPipeline = isGenerating || agents.some((a) => a.status !== "pending");

  if (!showPipeline) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">AI Agent Pipeline</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent, index) => {
          const Icon = ICONS[agent.name];
          const badge = STATUS_BADGE[agent.status];
          const isRunning = agent.status === "running";

          return (
            <Card
              key={agent.name}
              glow={isRunning}
              className={`relative overflow-hidden transition-all duration-500 ${
                isRunning ? "scale-[1.02]" : ""
              }`}
            >
              {isRunning && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-cyan-500/10 animate-pulse" />
              )}
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      agent.status === "complete"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isRunning
                          ? "bg-violet-500/20 text-violet-400"
                          : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {agent.status === "complete" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isRunning ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500 font-mono">
                    Agent {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-white">{agent.label}</h3>
                <p className="text-sm text-slate-400 mt-1">{agent.description}</p>

                {index < agents.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full z-10">
                    <Circle
                      className={`w-2 h-2 ${
                        agent.status === "complete" ? "text-emerald-400" : "text-slate-600"
                      }`}
                      fill="currentColor"
                    />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
