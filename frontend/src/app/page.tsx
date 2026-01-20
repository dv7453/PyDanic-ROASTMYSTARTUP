"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '../components/ChatInterface';
import LogConsole from '../components/LogConsole';
import { RoastResultData } from '../components/RoastResult';
import { useAnalysis } from '../context/AnalysisContext';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();
    const {
        setAnalysisData,
        hasAnalysis,
        messages,
        setMessages,
        logs,
        setLogs,
        analysisContextStr,
        setAnalysisContextStr,
        resetAll
    } = useAnalysis();

    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (input: string) => {
        const userMsg = { role: 'user' as const, content: input, type: 'text' as const };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const isPitch = !analysisContextStr;
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const endpoint = isPitch ? `${API_URL}/analyze` : `${API_URL}/chat`;

            const body = isPitch
                ? { pitch: input, intensity: 'Normal' }
                : { messages: [...messages, userMsg], context: analysisContextStr };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            // For chat, initialize an empty assistant message to stream into
            if (!isPitch) {
                setMessages(prev => [...prev, { role: 'assistant' as const, content: '', type: 'text' as const }]);
            }

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });
                const lines = chunkValue.split('\n');

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const event = JSON.parse(line);

                        if (event.type === 'log') {
                            setLogs(prev => [...prev, event.message]);
                        }
                        else if (event.type === 'result') {
                            const resultData = event.data as RoastResultData;
                            setAnalysisContextStr(JSON.stringify(resultData));
                            setAnalysisData(resultData);

                            const score = resultData.verdict.viability_score;
                            const killReason = resultData.verdict.kill_reason;

                            const summaryResponse = score <= 3
                                ? `Your idea scored ${score}/10. In short: "${killReason}" Check the Dashboard for the full breakdown. Try to defend your idea - maybe you can improve that score.`
                                : score <= 6
                                    ? `Interesting. Your idea scored ${score}/10. "${killReason}" There's potential here, but you'll need to address the flaws. Check the Dashboard for details, then come back and convince me.`
                                    : `Not bad. ${score}/10. "${killReason}" You've got something, but don't get cocky. Review the Dashboard and let's see if you can push higher.`;

                            setMessages(prev => [...prev, {
                                role: 'assistant' as const,
                                content: summaryResponse,
                                type: 'text' as const
                            }]);
                        }
                        else if (event.type === 'chunk') {
                            setMessages(prev => {
                                const newHistory = [...prev];
                                const lastIndex = newHistory.length - 1;
                                const lastMsg = newHistory[lastIndex];
                                if (lastMsg && lastMsg.role === 'assistant' && lastMsg.type === 'text') {
                                    newHistory[lastIndex] = {
                                        ...lastMsg,
                                        content: lastMsg.content + event.content
                                    };
                                }
                                return newHistory;
                            });
                        }
                        else if (event.type === 'error') {
                            setLogs(prev => [...prev, `ERROR: ${event.message}`]);
                        }
                    } catch (e) {
                        console.warn("Error parsing chunk", e);
                    }
                }
            }

        } catch (error: any) {
            setLogs(prev => [...prev, `CRITICAL ERROR: ${error.message}`]);
            setMessages(prev => [...prev, { role: 'assistant' as const, content: "System failure. Even our servers couldn't handle this.", type: 'text' as const }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex h-screen overflow-hidden noise-overlay" style={{ background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #0f0f0f 100%)' }}>
            {/* Left Panel: Chat Interface */}
            <section className="flex-1 h-full flex flex-col relative">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-600/5 blur-3xl rounded-full pointer-events-none"></div>

                {/* Header */}
                <header className="relative z-10 px-6 py-4 border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        <div className="flex items-center gap-4">
                            {/* Logo */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg shadow-red-900/30 border border-red-800/50">
                                <img
                                    src="/asset/angry-furious-asian-business-man-600nw-2654526239.webp"
                                    alt="Angry VC"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-white">
                                    Roast My Startup
                                </h1>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                    Adversarial Analysis Engine
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Dashboard Link */}
                            {hasAnalysis && (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-widest text-cyan-400 hover:text-white border border-cyan-900/30 hover:border-cyan-600/50 rounded-full transition-all duration-200 hover:bg-cyan-600/10"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Dashboard
                                </Link>
                            )}

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
                                <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                                    {loading ? 'Processing' : 'Ready'}
                                </span>
                            </div>

                            {/* Reset Button */}
                            {analysisContextStr && (
                                <button
                                    onClick={resetAll}
                                    className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-red-400 hover:text-white border border-red-900/30 hover:border-red-600/50 rounded-full transition-all duration-200 hover:bg-red-600/10"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-hidden relative">
                    <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        loading={loading}
                    />
                </div>
            </section>

            {/* Divider */}
            <div className="w-px bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent"></div>

            {/* Right Panel: Logs */}
            <section className="w-80 h-full flex-shrink-0">
                <LogConsole logs={logs} />
            </section>
        </main>
    );
}
