// src/app/analysis/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useAnalysis } from '@/hooks/use-app';
import { usePerforma } from '@/hooks/use-app';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, AlertCircle, Loader } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function AnalysisPage() {
    const { anomalies, loading, error, detectAnomalies } = useAnalysis();
    const { performaRecords } = usePerforma();

    useEffect(() => {
        const engineLogs = performaRecords
            .map(record => {
                try {
                    const data = JSON.parse(record.keterangan);
                    if (data && data.datetime) { // Check if it's an engine log
                        return {
                            timestamp: data.datetime,
                            parameters: { ...data.portside, ...data.starboard, ...data.generator }
                        };
                    }
                } catch (e) {
                    // Ignore non-JSON or non-engine-log records
                }
                return null;
            })
            .filter(log => log !== null);
            
        if(engineLogs.length > 0) {
            detectAnomalies(engineLogs as any);
        }
    }, [performaRecords, detectAnomalies]);
    
    const chartData = anomalies.map(anomaly => ({
        name: `${anomaly.parameter.split('.').pop()} @ ${new Date(anomaly.timestamp).toLocaleTimeString()}`,
        'Actual': anomaly.actualValue,
        'Expected': anomaly.expectedValue,
    }));
    
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-headline font-bold text-foreground">Engine Log Analysis</h2>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Anomaly Detection</CardTitle>
                    <CardDescription>AI-powered analysis to detect anomalies in engine performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">Analyzing engine logs...</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center justify-center py-8 text-destructive">
                            <AlertCircle className="h-8 w-8" />
                            <p className="ml-4">{error}</p>
                        </div>
                    )}
                    {!loading && !error && anomalies.length === 0 && (
                         <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">No anomalies detected. All systems normal.</p>
                        </div>
                    )}
                    {!loading && !error && anomalies.length > 0 && (
                        <div className="space-y-8">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Anomaly Comparison Chart</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <ResponsiveContainer width="100%" height={300}>
                                        <RechartsBarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                                            <YAxis />
                                            <Tooltip
                                                content={({ active, payload, label }) =>
                                                    active && payload?.length ? (
                                                        <ChartTooltipContent
                                                            label={label}
                                                            payload={payload}
                                                            className="bg-card"
                                                        />
                                                    ) : null
                                                }
                                            />
                                            <Legend />
                                            <Bar dataKey="Actual" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Expected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Parameter</TableHead>
                                        <TableHead>Values (Actual/Expected)</TableHead>
                                        <TableHead>Possible Causes</TableHead>
                                        <TableHead>Recommendations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {anomalies.map((anomaly, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <p className="font-semibold">{anomaly.parameter}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(anomaly.timestamp).toLocaleString()}</p>
                                            </TableCell>
                                            <TableCell>
                                                 <Badge variant="destructive">{anomaly.actualValue}</Badge> / <Badge variant="secondary">{anomaly.expectedValue}</Badge>
                                            </TableCell>
                                            <TableCell>{anomaly.possibleCauses}</TableCell>
                                            <TableCell>{anomaly.recommendedActions}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
