'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { detectEngineAnomalies, type DetectEngineAnomaliesOutput } from '@/ai/flows/detect-engine-anomalies';
import { Bot, Plus, Trash2, FileWarning, CheckCircle, Ship, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEngineLog } from '@/hooks/use-app';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const logEntrySchema = z.object({
  oilPressure: z.coerce.number(),
  waterTemp: z.coerce.number(),
  rpm: z.coerce.number(),
});

const formSchema = z.object({
  logEntries: z.array(logEntrySchema).min(2, "At least two log entries are required for analysis."),
});

type FormData = z.infer<typeof formSchema>;

export default function AnomalyDetectorPage() {
  const [analysisResult, setAnalysisResult] = useState<DetectEngineAnomaliesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addEngineLog } = useEngineLog();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logEntries: [{ oilPressure: 7.1, waterTemp: 85, rpm: 90 }, { oilPressure: 6.5, waterTemp: 95, rpm: 92 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "logEntries",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const logData = data.logEntries.map((entry, index) => ({
        timestamp: new Date(Date.now() - (data.logEntries.length - index) * 60000).toISOString(),
        parameters: {
            "oil_pressure_bar": entry.oilPressure,
            "water_temperature_celsius": entry.waterTemp,
            "engine_rpm": entry.rpm,
        }
    }));
    
    try {
      const result = await detectEngineAnomalies({ logData });
      setAnalysisResult(result);
      addEngineLog(logData);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-headline font-bold text-foreground">Anomaly Detection</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Engine Log Analysis</CardTitle>
          <CardDescription>
            Input a series of engine log entries. The AI will analyze the data for potential anomalies and provide recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2 p-4 border rounded-lg bg-card-foreground/5 relative">
                    <p className="absolute top-1 left-3 text-xs text-muted-foreground font-medium">Log Entry #{index + 1}</p>
                    <FormField
                      control={form.control}
                      name={`logEntries.${index}.oilPressure`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Oil Pressure (bar)</FormLabel>
                          <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`logEntries.${index}.waterTemp`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Water Temp (°C)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`logEntries.${index}.rpm`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>RPM</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 2}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
               <Button type="button" variant="outline" onClick={() => append({ oilPressure: 0, waterTemp: 0, rpm: 0 })}>
                <Plus className="mr-2 h-4 w-4" /> Add Log Entry
              </Button>
              <FormField
                control={form.control}
                name="logEntries"
                render={() => <FormMessage />}
              />

              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? 'Analyzing...' : 'Run Analysis'}
                <Bot className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center p-8 space-y-2">
            <Wind className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="font-medium">AI is analyzing the data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold">Analysis Complete</h3>
            {analysisResult.anomalies.length > 0 ? (
                 <div className="grid gap-4 md:grid-cols-2">
                    {analysisResult.anomalies.map((anomaly, index) => (
                        <Card key={index} className="bg-destructive/10 border-destructive">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-destructive">
                                    <FileWarning /> Anomaly Detected: {anomaly.parameter.replace(/_/g, ' ')}
                                </CardTitle>
                                <CardDescription>
                                    At: {new Date(anomaly.timestamp).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-around text-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Expected</p>
                                        <p className="text-2xl font-bold">{anomaly.expectedValue}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Actual</p>
                                        <p className="text-2xl font-bold text-destructive">{anomaly.actualValue}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Possible Causes</h4>
                                    <p className="text-sm text-muted-foreground">{anomaly.possibleCauses}</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div>
                                    <h4 className="font-semibold">Recommended Actions</h4>
                                    <p className="text-sm text-muted-foreground">{anomaly.recommendedActions}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                 </div>
            ) : (
                <Alert className="border-green-500/50 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>No Anomalies Found</AlertTitle>
                    <AlertDescription>The engine parameters appear to be within normal operating ranges based on the provided data.</AlertDescription>
                </Alert>
            )}
        </div>
      )}
    </div>
  );
}
