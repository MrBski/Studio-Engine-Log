'use client';

import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-bold text-center p-2 my-2 rounded-md text-primary-foreground text-sm", className)}>
    {children}
  </h3>
);

const DataRow = ({ label, value, className }: { label: string, value: any, className?: string }) => {
    const displayValue = (val: any) => {
        if (val === null || val === undefined || val === '') return 'N/A';
        if (typeof val === 'number') return val.toFixed(2);
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) return JSON.stringify(val);
        return String(val);
    }
    return (
        <div className={cn("flex items-center border-b border-white/5 py-1", className)}>
            <label className="w-1/2 font-medium text-sm text-muted-foreground">{label}</label>
            <div className="w-1/2 text-right font-mono text-sm">{displayValue(value)}</div>
        </div>
    );
};


export function EngineLogViewer({ data }: { data: any }) {
  if (!data) return null;
  
  const parsedDate = data.datetime ? (typeof data.datetime === 'string' ? parseISO(data.datetime) : new Date(data.datetime)) : null;
  const formattedDate = parsedDate && isValid(parsedDate) ? format(parsedDate, "Pp") : 'N/A';

  const flowmeterUsage = data.flowmeter ? data.flowmeter.after - data.flowmeter.before : 0;
  const dailyUsage = data.daily ? data.daily.after - data.daily.before : 0;

  return (
    <div className="space-y-4 pb-8 bg-card p-4 rounded-lg">
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Engine Log Sheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm max-w-md mx-auto">
                <div className="font-bold text-center text-lg h-12 flex items-center justify-center bg-muted/50 rounded-md">
                    {formattedDate}
                </div>
                
                {data.portside && (
                <div className="space-y-3">
                    <SectionTitle className="bg-red-600">M.E Port Side</SectionTitle>
                    <DataRow label="RPM" value={data.portside.rpm} />
                    <DataRow label="L.O. PRESS" value={data.portside.lo_press} />
                    <DataRow label="Exhaust 1" value={data.portside.exhaust1} />
                    <DataRow label="Exhaust 2" value={data.portside.exhaust2} />
                    <DataRow label="Radiator" value={data.portside.radiator} />
                    <DataRow label="SW Temp" value={data.portside.sw_temp} />
                    <DataRow label="F.W. COOLERS In" value={data.portside.fw_coolers_in} />
                    <DataRow label="F.W. COOLERS Out" value={data.portside.fw_coolers_out} />
                    <DataRow label="L.O. COOLERS In" value={data.portside.lo_coolers_in} />
                    <DataRow label="L.O. COOLERS Out" value={data.portside.lo_coolers_out} />
                </div>
                )}

                {data.starboard && (
                <div className="space-y-3">
                    <SectionTitle className="bg-green-600">M.E Starboard</SectionTitle>
                    <DataRow label="RPM" value={data.starboard.rpm} />
                    <DataRow label="L.O. PRESS" value={data.starboard.lo_press} />
                    <DataRow label="Exhaust 1" value={data.starboard.exhaust1} />
                    <DataRow label="Exhaust 2" value={data.starboard.exhaust2} />
                    <DataRow label="Radiator" value={data.starboard.radiator} />
                    <DataRow label="SW Temp" value={data.starboard.sw_temp} />
                    <DataRow label="F.W. COOLERS In" value={data.starboard.fw_coolers_in} />
                    <DataRow label="F.W. COOLERS Out" value={data.starboard.fw_coolers_out} />
                    <DataRow label="L.O. COOLERS In" value={data.starboard.lo_coolers_in} />
                    <DataRow label="L.O. COOLERS Out" value={data.starboard.lo_coolers_out} />
                </div>
                )}
                
                {data.generator && (
                <div className="space-y-3">
                    <SectionTitle className="bg-sky-600">Generator</SectionTitle>
                    <DataRow label="L.O. PRESS" value={data.generator.lo_press} />
                    <DataRow label="F.W. TEMP" value={data.generator.fw_temp} />
                    <DataRow label="VOLTS" value={data.generator.volts} />
                    <DataRow label="AMPERE" value={data.generator.ampere} />
                </div>
                )}
                
                {data.flowmeter && (
                <div className="space-y-3">
                    <SectionTitle className="bg-amber-600">Flowmeter</SectionTitle>
                    <DataRow label="Before" value={data.flowmeter.before} />
                    <DataRow label="After" value={data.flowmeter.after} />
                    <DataRow label="Used" value={flowmeterUsage} className="font-bold text-accent-foreground bg-accent/20" />
                </div>
                )}
                
                {data.daily && (
                <div className="space-y-3">
                    <SectionTitle className="bg-purple-600">Daily</SectionTitle>
                    <DataRow label="Before" value={data.daily.before} />
                    <DataRow label="After" value={data.daily.after} />
                    <DataRow label="Used" value={dailyUsage} className="font-bold text-accent-foreground bg-accent/20" />
                </div>
                )}
                
                {data.onduty && (
                <div className="space-y-3">
                    <SectionTitle className="bg-cyan-600">On Duty</SectionTitle>
                    <DataRow label="Before" value={data.onduty.before} />
                </div>
                )}
                
                <div className="space-y-3">
                    <SectionTitle className="bg-slate-500">Other</SectionTitle>
                    <DataRow label="RoB" value={data.rob} />
                    <DataRow label="USED 4 Hours" value={data.used4hours} />
                </div>
                
                {data.user && (
                <div className="pt-4 space-y-2">
                    <SectionTitle className="bg-muted text-muted-foreground">On Duty Engineer</SectionTitle>
                    <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user.date}</div>
                    <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user.name}</div>
                    <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user.position}</div>
                </div>
                )}

                {data.condition && (
                <div className="pt-4">
                    <SectionTitle className="bg-muted text-muted-foreground">Condition</SectionTitle>
                    <div className="text-center font-bold p-4 rounded-md bg-muted/50 min-h-[60px] flex items-center justify-center">
                        {data.condition}
                    </div>
                </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
