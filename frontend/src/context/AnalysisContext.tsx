"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RoastResultData } from '../components/RoastResult';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    type: 'text';
}

interface AnalysisContextType {
    analysisData: RoastResultData | null;
    setAnalysisData: (data: RoastResultData | null) => void;
    currentScore: number;
    updateScore: (newScore: number) => void;
    hasAnalysis: boolean;
    // Chat state (persists across navigation)
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    logs: string[];
    setLogs: React.Dispatch<React.SetStateAction<string[]>>;
    analysisContextStr: string;
    setAnalysisContextStr: (ctx: string) => void;
    resetAll: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [analysisData, setAnalysisDataState] = useState<RoastResultData | null>(null);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [analysisContextStr, setAnalysisContextStr] = useState<string>("");

    const setAnalysisData = (data: RoastResultData | null) => {
        setAnalysisDataState(data);
        if (data) setCurrentScore(data.verdict.viability_score);
    };

    const updateScore = (newScore: number) => {
        setCurrentScore(Math.min(10, Math.max(0, newScore)));
        if (analysisData) {
            setAnalysisDataState({
                ...analysisData,
                verdict: {
                    ...analysisData.verdict,
                    viability_score: newScore
                }
            });
        }
    };

    const resetAll = () => {
        setAnalysisDataState(null);
        setCurrentScore(0);
        setMessages([]);
        setLogs([]);
        setAnalysisContextStr("");
    };

    return (
        <AnalysisContext.Provider
            value={{
                analysisData,
                setAnalysisData,
                currentScore,
                updateScore,
                hasAnalysis: analysisData !== null,
                messages,
                setMessages,
                logs,
                setLogs,
                analysisContextStr,
                setAnalysisContextStr,
                resetAll
            }}
        >
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
}
