"use client";

import { useState } from "react";

interface RuleClarity {
  score: string;
  analysis: string;
}

interface ListSection {
  summary: string;
  items: string[];
}

interface TechnologySection {
  technologies: string[];
  rationale: string;
}

interface ComplexitySection {
  level: "Low" | "Medium" | "High";
  explanation: string;
}

interface AnalysisResult {
  rule_clarity: RuleClarity;
  operational_risks: ListSection;
  automation_opportunities: ListSection;
  recommended_technology: TechnologySection;
  complexity_level: ComplexitySection;
}

const COMPLEXITY_STYLES: Record<string, string> = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  High: "bg-red-100 text-red-800 border-red-200",
};

const TECH_STYLES: Record<string, string> = {
  RPA: "bg-purple-100 text-purple-800",
  AI: "bg-blue-100 text-blue-800",
  Workflow: "bg-teal-100 text-teal-800",
  OCR: "bg-orange-100 text-orange-800",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function Home() {
  const [processDescription, setProcessDescription] = useState("");
  const [businessRule, setBusinessRule] = useState("");
  const [volumeSla, setVolumeSla] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!processDescription.trim() || !businessRule.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processDescription, businessRule, volumeSla }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed. Please try again.");
      }

      setResult(data as AnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = processDescription.trim() && businessRule.trim() && !loading;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Process Rule Validator</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze business process rules for clarity, operational risk, and automation potential.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Process Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={processDescription}
                onChange={(e) => setProcessDescription(e.target.value)}
                rows={4}
                placeholder="Describe the end-to-end business process…"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Rule <span className="text-red-500">*</span>
              </label>
              <textarea
                value={businessRule}
                onChange={(e) => setBusinessRule(e.target.value)}
                rows={4}
                placeholder="State the specific business rule to be validated…"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Volume / SLA{" "}
                <span className="text-xs text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={volumeSla}
                onChange={(e) => setVolumeSla(e.target.value)}
                placeholder="e.g. 500 invoices/day, 24-hour turnaround"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse"
              >
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-4">
            {/* Rule Clarity */}
            <Card title="Rule Clarity">
              <p className="text-base font-semibold text-gray-900 mb-2">
                {result.rule_clarity.score}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {result.rule_clarity.analysis}
              </p>
            </Card>

            {/* Operational Risks */}
            <Card title="Operational Risks">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {result.operational_risks.summary}
              </p>
              {result.operational_risks.items.length > 0 && (
                <ul className="space-y-2">
                  {result.operational_risks.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Automation Opportunities */}
            <Card title="Automation Opportunities">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {result.automation_opportunities.summary}
              </p>
              {result.automation_opportunities.items.length > 0 && (
                <ul className="space-y-2">
                  {result.automation_opportunities.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Recommended Technology */}
            <Card title="Recommended Technology">
              <div className="flex flex-wrap gap-2 mb-3">
                {result.recommended_technology.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      TECH_STYLES[tech] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {result.recommended_technology.rationale}
              </p>
            </Card>

            {/* Complexity Level */}
            <Card title="Complexity Level">
              <div className="mb-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
                    COMPLEXITY_STYLES[result.complexity_level.level] ??
                    "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {result.complexity_level.level}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {result.complexity_level.explanation}
              </p>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
