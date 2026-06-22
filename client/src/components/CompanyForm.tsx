import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { CHANNEL_OPTIONS, DEMO_COMPANY, type CompanyInput } from "../types/campaign";

interface CompanyFormProps {
  onSubmit: (input: CompanyInput) => void;
  isGenerating: boolean;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors";

const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

export function CompanyForm({ onSubmit, isGenerating }: CompanyFormProps) {
  const [form, setForm] = useState<CompanyInput>(DEMO_COMPANY);

  const toggleChannel = (channel: string) => {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.channels.length === 0) return;
    onSubmit(form);
  };

  const loadDemo = () => setForm(DEMO_COMPANY);

  return (
    <Card glow>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Company Details</h2>
          <p className="text-sm text-slate-400 mt-1">
            Tell our AI agents about your business
          </p>
        </div>
        <Button variant="ghost" size="sm" type="button" onClick={loadDemo}>
          <RotateCcw className="w-4 h-4" />
          Load Demo
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Company Name</label>
            <input
              className={inputClass}
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <input
              className={inputClass}
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Product / Service</label>
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            value={form.productService}
            onChange={(e) => setForm({ ...form, productService: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Target Audience</label>
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Campaign Goal</label>
            <input
              className={inputClass}
              value={form.campaignGoal}
              onChange={(e) => setForm({ ...form, campaignGoal: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Budget Range</label>
            <input
              className={inputClass}
              value={form.budgetRange}
              onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Preferred Channels</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CHANNEL_OPTIONS.map((channel) => (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  form.channels.includes(channel)
                    ? "bg-violet-600/40 text-violet-200 ring-1 ring-violet-500/50"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isGenerating || form.channels.length === 0}
          className="w-full mt-2"
        >
          <Sparkles className="w-5 h-5" />
          {isGenerating ? "Generating Campaign..." : "Generate Campaign"}
        </Button>
      </form>
    </Card>
  );
}
