import { useRef } from "react";
import { Bot, Zap, AlertCircle } from "lucide-react";
import { CompanyForm } from "./components/CompanyForm";
import { AgentPipeline } from "./components/AgentPipeline";
import { CampaignResults } from "./components/CampaignResults";
import { useCampaignStream } from "./hooks/useCampaignStream";

export default function App() {
  const { agents, campaign, isGenerating, error, generate, reset } = useCampaignStream();
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm text-slate-300 mb-6">
            <Bot className="w-4 h-4 text-violet-400" />
            Multi-Agent AI System
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              MarketingGenius AI
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Four specialized AI agents collaborate to research your market, craft strategy,
            generate content, and forecast ROI — delivering a complete campaign in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Research", "Strategy", "Content", "Analytics"].map((agent) => (
              <span
                key={agent}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm text-slate-300"
              >
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                {agent} Agent
              </span>
            ))}
          </div>
          {!campaign && !isGenerating && (
            <button
              onClick={scrollToForm}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-cyan-400 transition-all"
            >
              Start Campaign
            </button>
          )}
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-300">Generation failed</p>
              <p className="text-sm text-red-400/80 mt-1">{error}</p>
              <button
                onClick={reset}
                className="text-sm text-red-300 underline mt-2 hover:text-red-200"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div ref={formRef} className="mb-10">
          <CompanyForm onSubmit={generate} isGenerating={isGenerating} />
        </div>

        {/* Pipeline */}
        <AgentPipeline agents={agents} isGenerating={isGenerating} />

        {/* Results */}
        {campaign && <CampaignResults campaign={campaign} />}

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-slate-600">
          MarketingGenius AI · Hackathon Demo · Powered by OpenAI
        </footer>
      </div>
    </div>
  );
}
