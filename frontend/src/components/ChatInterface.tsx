import React, { useRef, useEffect, useState } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    type: 'text';
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (msg: string) => void;
    loading: boolean;
}

export default function ChatInterface({ messages, onSendMessage, loading }: ChatInterfaceProps) {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 100%)' }}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="relative">
                            {/* Animated Ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-red-600/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                            <div className="relative w-24 h-24 rounded-full border border-red-600/30 flex items-center justify-center">
                                <svg className="w-10 h-10 text-red-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="mt-8 text-xl font-light tracking-wide text-gray-500 uppercase">
                            Submit Your Idea
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 max-w-xs text-center">
                            Enter your startup pitch below. We will tear it apart.
                        </p>
                    </div>
                )}

                <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {msg.role === 'user' ? (
                                /* User Message */
                                <div className="max-w-[75%]">
                                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl rounded-tr-sm px-5 py-3 shadow-lg">
                                        <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-1 text-right uppercase tracking-wider">You</p>
                                </div>
                            ) : (
                                /* Assistant Message */
                                <div className="max-w-[85%]">
                                    <div className="flex gap-4">
                                        {/* Red Accent Line */}
                                        <div className="w-1 bg-gradient-to-b from-red-600 to-red-900 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            <p className="text-[10px] text-red-600/50 mt-2 uppercase tracking-wider">Analyst</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {loading && (
                        <div className="flex gap-4 animate-in fade-in duration-300">
                            <div className="w-1 bg-gradient-to-b from-red-600 to-red-900 rounded-full"></div>
                            <div className="flex items-center gap-1 py-2">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-zinc-800/50 bg-gradient-to-t from-black to-transparent">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 to-red-900/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>

                        <div className="relative flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={loading ? "Processing..." : "Type your pitch or defend your idea..."}
                                disabled={loading}
                                className="flex-1 bg-transparent px-5 py-4 text-white placeholder-zinc-600 focus:outline-none text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="m-2 px-5 py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-900/20 disabled:shadow-none"
                            >
                                {loading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <span>Send</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-zinc-600 mt-3 uppercase tracking-wider">
                        Press Enter to submit • Be specific for better analysis
                    </p>
                </form>
            </div>
        </div>
    );
}
