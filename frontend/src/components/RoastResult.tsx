import React from 'react';

interface Assumption {
  description: string;
  category: string;
  confidence_score: string;
  reason_risky: string;
}

interface FailureScenario {
  scenario_name: string;
  description: string;
  probability: string;
  impact: string;
  mechanism_of_failure: string;
}

interface RoastCritique {
  market_delusions: string;
  execution_fantasy: string;
  competitive_reality: string;
  timeline_lies: string;
  overall_harshness_comment: string;
}

interface RoastRound {
  round_number: number;
  critique: RoastCritique;
  survived: boolean;
  fatal_flaw_found?: string;
}

interface Verdict {
  final_verdict: string;
  ranked_fatal_flaws: string[];
  assumptions_that_broke: string[];
  kill_reason: string;
  viability_score: number;
}

export interface RoastResultData {
  analysis: any;
  assumptions: Assumption[];
  failure_simulation: { scenarios: FailureScenario[] };
  roast_rounds: RoastRound[];
  verdict: Verdict;
}

export default function RoastResult({ data }: { data: RoastResultData }) {
  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'from-red-600 to-red-500';
    if (score <= 6) return 'from-yellow-600 to-yellow-500';
    return 'from-green-600 to-green-500';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 2) return 'DEAD ON ARRIVAL';
    if (score <= 4) return 'CRITICAL';
    if (score <= 6) return 'STRUGGLING';
    if (score <= 8) return 'VIABLE';
    return 'PROMISING';
  };

  const getProbColor = (prob: string) => {
    if (prob === 'High' || prob === 'Certain') return 'bg-red-900/50 text-red-400 border-red-800/50';
    if (prob === 'Medium') return 'bg-yellow-900/50 text-yellow-400 border-yellow-800/50';
    return 'bg-green-900/50 text-green-400 border-green-800/50';
  };

  return (
    <div className="space-y-8 w-full">
      {/* Verdict Hero Section */}
      <section className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative">
          {/* Score Display */}
          <div className="flex items-start justify-between gap-8 mb-8">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-widest text-red-500/70 font-mono">Final Verdict</span>
              <h2 className="text-2xl font-bold text-white mt-2 leading-tight">
                {data.verdict.final_verdict}
              </h2>
            </div>

            {/* Viability Score Circle */}
            <div className="flex-shrink-0 relative">
              <div className="w-24 h-24 rounded-full border-4 border-zinc-800 flex items-center justify-center relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getScoreColor(data.verdict.viability_score)} opacity-20`}
                ></div>
                <div className="text-center relative z-10">
                  <span className={`text-3xl font-black bg-gradient-to-br ${getScoreColor(data.verdict.viability_score)} bg-clip-text text-transparent`}>
                    {data.verdict.viability_score}
                  </span>
                  <span className="text-gray-500 text-sm">/10</span>
                </div>
              </div>
              <p className="text-[9px] text-center mt-2 uppercase tracking-widest text-zinc-500">
                {getScoreLabel(data.verdict.viability_score)}
              </p>
            </div>
          </div>

          {/* Kill Shot */}
          <div className="bg-black/50 border border-red-900/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-red-500 font-mono">Kill Shot</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "{data.verdict.kill_reason}"
            </p>
          </div>
        </div>
      </section>

      {/* Roast Rounds */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
          <h2 className="text-sm uppercase tracking-widest text-zinc-500 font-mono">The Beatdown</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent"></div>
        </div>

        <div className="space-y-4">
          {data.roast_rounds.map((round) => (
            <details
              key={round.round_number}
              className="group bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden"
              open={round.round_number === 1}
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                    {round.round_number}
                  </span>
                  <span className="text-sm text-gray-300">Round {round.round_number}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${round.survived
                      ? 'bg-green-900/30 text-green-400 border border-green-800/30'
                      : 'bg-red-900/30 text-red-400 border border-red-800/30'
                    }`}>
                    {round.survived ? 'Survived' : 'Fatal'}
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>

              <div className="p-4 pt-0 space-y-4 border-t border-zinc-800/50">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase tracking-widest text-red-500/70">Market Delusions</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{round.critique.market_delusions}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase tracking-widest text-red-500/70">Competitive Reality</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{round.critique.competitive_reality}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase tracking-widest text-red-500/70">Execution Fantasy</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{round.critique.execution_fantasy}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase tracking-widest text-red-500/70">Timeline Lies</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{round.critique.timeline_lies}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-zinc-800/30">
                  <p className="text-sm text-red-400/80 italic">"{round.critique.overall_harshness_comment}"</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom Grid: Assumptions & Failures */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assumptions */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-yellow-500/70 font-mono mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
            Risky Assumptions
          </h3>
          <div className="space-y-3">
            {data.assumptions.slice(0, 4).map((ass, i) => (
              <div
                key={i}
                className="bg-zinc-900/30 border-l-2 border-yellow-600/50 p-3 rounded-r-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500">{ass.category}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${ass.confidence_score === 'Low' ? 'bg-red-900/30 text-red-400' :
                      ass.confidence_score === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-green-900/30 text-green-400'
                    }`}>
                    {ass.confidence_score}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-1">{ass.description}</p>
                <p className="text-[10px] text-red-400/70">Risk: {ass.reason_risky}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Modes */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-purple-500/70 font-mono mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Failure Modes
          </h3>
          <div className="space-y-3">
            {data.failure_simulation.scenarios.map((fail, i) => (
              <div
                key={i}
                className="bg-zinc-900/30 border-l-2 border-purple-600/50 p-3 rounded-r-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{fail.scenario_name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${getProbColor(fail.probability)}`}>
                    {fail.probability} Prob.
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{fail.mechanism_of_failure}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
