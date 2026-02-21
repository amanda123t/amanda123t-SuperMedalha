"use client";

import { useState } from "react";
import TimelineJourney from "./components/TimelineJourney";
import SignalLibrary from "./components/SignalLibrary";

type Tab = "timeline" | "signals";

const TABS: { id: Tab; label: string; icon: string; description: string }[] = [
  {
    id: "timeline",
    label: "Jornada da Mudança",
    icon: "🗺️",
    description: "5 fases, do diagnóstico à sustentação",
  },
  {
    id: "signals",
    label: "Biblioteca de Sinais",
    icon: "📡",
    description: "Frases do cliente e o que elas revelam",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Brand row */}
          <div className="flex items-center justify-between py-4 border-b border-gray-800/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                G
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">
                  GMO em Prática
                </h1>
                <p className="text-[11px] text-gray-500 leading-tight hidden sm:block">
                  Gestão de Mudança Organizacional — Times Comerciais
                </p>
              </div>
            </div>
            <span className="text-[11px] text-gray-600 bg-gray-800 px-2.5 py-1 rounded-full hidden sm:inline">
              Ferramenta Interativa
            </span>
          </div>

          {/* Tab row */}
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700 font-medium"
                }`}
              >
                <span className="text-base leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] hidden md:inline transition-colors ${
                    activeTab === tab.id ? "text-blue-500/70" : "text-gray-700"
                  }`}
                >
                  — {tab.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {activeTab === "timeline" ? <TimelineJourney /> : <SignalLibrary />}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            GMO em Prática · Ferramenta para times comerciais
          </p>
          <p className="text-xs text-gray-700">
            Gestão de Mudança Organizacional
          </p>
        </div>
      </footer>
    </main>
  );
}
