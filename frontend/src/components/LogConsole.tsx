import React, { useEffect, useRef } from 'react';

interface LogConsoleProps {
    logs: string[];
}

export default function LogConsole({ logs }: LogConsoleProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLogStyle = (log: string) => {
        if (log.includes('ERROR') || log.includes('CRITICAL')) {
            return 'text-red-400';
        }
        if (log.includes('Step')) {
            return 'text-cyan-400';
        }
        if (log.includes('Round')) {
            return 'text-yellow-400';
        }
        return 'text-green-400';
    };

    const getLogIcon = (log: string) => {
        if (log.includes('ERROR') || log.includes('CRITICAL')) {
            return '✕';
        }
        if (log.includes('Step')) {
            return '▸';
        }
        if (log.includes('Round')) {
            return '◆';
        }
        return '○';
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a0a] relative overflow-hidden">
            {/* Scanline Effect */}
            <div
                className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
                }}
            />

            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest ml-3 font-mono">
                        system.log
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span className="text-[10px] text-cyan-500/70 uppercase tracking-widest font-mono">
                        Live
                    </span>
                </div>
            </div>

            {/* Log Content */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                        <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center mb-3">
                            <span className="text-lg">⟳</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest">Awaiting Input</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {logs.map((log, index) => (
                            <div
                                key={index}
                                className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-200"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                {/* Timestamp */}
                                <span className="text-zinc-600 whitespace-nowrap flex-shrink-0">
                                    {new Date().toLocaleTimeString('en-US', { hour12: false })}
                                </span>

                                {/* Icon */}
                                <span className={`${getLogStyle(log)} flex-shrink-0`}>
                                    {getLogIcon(log)}
                                </span>

                                {/* Message */}
                                <span className={`${getLogStyle(log)} break-words`}>
                                    {log}
                                </span>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-800/50 bg-zinc-900/30">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">
                        {logs.length} entries
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">
                        Analysis Engine v1.0
                    </span>
                </div>
            </div>
        </div>
    );
}
