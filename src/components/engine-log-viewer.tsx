'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-bold text-center p-2 my-2 rounded-md text-primary-foreground text-sm", className)}>
    {children}
  </h3>
);

const DataRow = ({ label, value }: { label: string, value: any }) => (
    <div className="flex items-center border-b border-white/5 py-1">
        <label className="w-1/2 font-medium text-sm text-muted-foreground">{label}</label>
        <div className="w-1/2 text-right font-mono text-sm">{String(value ?? 'N/A')}</div>
    </div>
);


export function EngineLogViewer({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-4 pb-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Engine Log Sheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm max-w-md mx-auto">
                <div className="font-bold text-center text-lg h-12 flex items-center justify-center bg-muted/50 rounded-md">
                    {data.datetime ? format(parseISO(data.datetime), "Pp") : 'N/A'}
                </div>
                
                <div className="space-y-3">
                    <SectionTitle className="bg-red-600">M.E Port Side</SectionTitle>
                    <DataRow label="RPM" value={data.portside?.rpm} />
                    <DataRow label="L.O. PRESS" value={data.portside?.lo_press} />
                    <DataRow label="Exhaust" value={data.portside?.exhaust} />
                    <DataRow label="Radiator" value={data.portside?.radiator} />
                    <DataRow label="SW Temp" value={data.portside?.sw_temp} />
                    <DataRow label="F.W. COOLERS" value={data.portside?.fw_coolers} />
                    <DataRow label="L.O. COOLERS" value={data.portside?.lo_coolers} />
                </div>

                <div className="space-y-3">
                    <SectionTitle className="bg-green-600">M.E Starboard</SectionTitle>
                    <DataRow label="RPM" value={data.starboard?.rpm} />
                    <DataRow label="L.O. PRESS" value={data.starboard?.lo_press} />
                    <DataRow label="Exhaust" value={data.starboard?.exhaust} />
                    <DataRow label="Radiator" value={data.starboard?.radiator} />
                    <DataRow label="SW Temp" value={data.starboard?.sw_temp} />
                    <DataRow label="F.W. COOLERS" value={data.starboard?.fw_coolers} />
                    <DataRow label="L.O. COOLERS" value={data.starboard?.lo_coolers} />
                </div>
                
                <div className="space-y-3">
                    <SectionTitle className="bg-sky-600">Generator</SectionTitle>
                    <DataRow label="L.O. PRESS" value={data.generator?.lo_press} />
                    <DataRow label="F.W. TEMP" value={data.generator?.fw_temp} />
                    <DataRow label="VOLTS" value={data.generator?.volts} />
                    <DataRow label="AMPERE" value={data.generator?.ampere} />
                </div>
                
                <div className="space-y-3">
                    <SectionTitle className="bg-amber-600">Flowmeter</SectionTitle>
                    <DataRow label="Before" value={data.flowmeter?.before} />
                    <DataRow label="After" value={data.flowmeter?.after} />
                </div>
                
                <div className="space-y-3">
                    <SectionTitle className="bg-purple-600">Daily</SectionTitle>
                    <DataRow label="Before" value={data.daily?.before} />
                    <DataRow label="After" value={data.daily?.after} />
                </div>
                
                <div className="space-y-3">
                    <SectionTitle className="bg-cyan-600">On Duty</SectionTitle>
                    <DataRow label="Before" value={data.onduty?.before} />
                </div>
                
                <div className="space-y-3">
                    <SectionTitle className="bg-slate-500">Other</SectionTitle>
                    <DataRow label="RoB" value={data.rob} />
                    <DataRow label="USED 4 Hours" value={data.used4hours} />
                </div>
                
                <div className="pt-4 space-y-2">
                    <SectionTitle className="bg-muted text-muted-foreground">On Duty Engineer</SectionTitle>
                    <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user?.date}</div>
                    <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user?.name}</div>
                    <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user?.position}</div>
                </div>

                <div className="pt-4">
                    <SectionTitle className="bg-muted text-muted-foreground">Condition</SectionTitle>
                    <div className="text-center font-bold p-4 rounded-md bg-muted/50 min-h-[60px] flex items-center justify-center">
                        {data.condition}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
