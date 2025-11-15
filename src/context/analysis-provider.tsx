// src/context/analysis-provider.tsx
'use client';

import React, { createContext, type ReactNode, useState, useCallback } from 'react';
import type { Anomaly, AnalysisContextType } from '@/lib/types';
import { detectEngineAnomalies } from '@/ai/flows/detect-engine-anomalies';
import { useToast } from '@/hooks/use-toast';

export const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleDetectAnomalies = useCallback(async (logData: any[]) => {
        setLoading(true);
        setError(null);
        try {
            const result = await detectEngineAnomalies({ logData });
            setAnomalies(result.anomalies);
            if (result.anomalies.length > 0) {
                 toast({
                    title: "Anomalies Detected!",
                    description: `Found ${result.anomalies.length} potential issues in the engine logs.`,
                });
            }
        } catch (e: any) {
            setError('Failed to analyze engine data. Please try again.');
            toast({
                variant: 'destructive',
                title: "Analysis Failed",
                description: e.message || 'An error occurred during AI analysis.',
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const value = {
        anomalies,
        loading,
        error,
        detectAnomalies: handleDetectAnomalies,
    };

    return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}
