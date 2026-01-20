"use client";

import { useAnalysis } from '../../context/AnalysisContext';
import RoastResult from '../../components/RoastResult';
import Link from 'next/link';

export default function Dashboard() {
    const { analysisData, currentScore, hasAnalysis } = useAnalysis();

    if (!hasAnalysis) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #0f0f0f 100%)' }}>
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">No Analysis Yet</h1>
                    <p className="text-zinc-500 text-sm mb-6">Submit your startup pitch to see the breakdown</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-red-900/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go to Chat
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #0f0f0f 100%)' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 px-6 py-4 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Chat
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Live Score */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/80 rounded-full border border-zinc-800">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Score</span>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-xl font-black ${currentScore <= 3 ? 'text-red-500' :
                                        currentScore <= 6 ? 'text-yellow-500' :
                                            'text-green-500'
                                    }`}>{currentScore}</span>
                                <span className="text-zinc-600 text-sm">/10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Analysis Dashboard</h1>
                    <p className="text-zinc-500 text-sm">Complete breakdown of your startup idea</p>
                </div>

                {analysisData && <RoastResult data={analysisData} />}

                {/* CTA */}
                <div className="mt-12 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Want to improve your score?</h3>
                    <p className="text-zinc-500 text-sm mb-4">Defend your idea in the chat. Each strong argument can improve your viability score.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-red-900/20"
                    >
                        Continue Defending
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </main>
    );
}
