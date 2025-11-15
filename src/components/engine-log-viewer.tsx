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
        <div className="w-1/2 text-right font-mono text-sm">{String(value)}</div>
    </div>
);

const HeaderRow = ({ labels }: { labels: string[] }) => (
    <div className="flex">
        <div className="w-1/2"></div>
        {labels.map(label => <div key={label} className="w-1/4 text-center font-bold text-sm text-muted-foreground">{label}</div>)}
    </div>
);

const ValueRow = ({ values }: { values: any[] }) => (
    <div className="flex items-center gap-2">
        <div className="w-1/2"></div>
        {values.map((value, i) => (
            <div key={i} className="w-1/4 text-right font-mono text-sm border-b border-white/5 py-1">{String(value)}</div>
        ))}
    </div>
);


export function EngineLogViewer({ data }: { data: any }) {
  if (!data) return null;

  const renderValue = (value: any) => (
     <div className="text-right font-mono text-sm border-b border-white/5 py-1">{String(value)}</div>
  )

  return (
    <div className="space-y-4 pb-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Engine Log Sheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="font-bold text-center text-lg h-12 flex items-center justify-center bg-muted/50 rounded-md">
                    {data.datetime ? format(parseISO(data.datetime), "Pp") : 'N/A'}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LEFT COLUMN */}
                    <div className="space-y-3">
                        <SectionTitle className="bg-red-600">M. E PORTSIDE</SectionTitle>
                        <DataRow label="RPM" value={data.portside?.rpm} />
                        <DataRow label="L. O PRESS" value={data.portside?.lo_press} />
                        <DataRow label="Exhaust" value={data.portside?.exhaust} />
                        <DataRow label="Radiator" value={data.portside?.radiator} />
                        <DataRow label="SW Temp" value={data.portside?.sw_temp} />
                        <DataRow label="F.W COOLERS" value={data.portside?.fw_coolers} />
                        <DataRow label="L.O COOLERS" value={data.portside?.lo_coolers} />

                        <SectionTitle className="bg-green-600">M. E STARBOARD</SectionTitle>
                        <DataRow label="RPM" value={data.starboard?.rpm} />
                        <DataRow label="L. O PRESS" value={data.starboard?.lo_press} />
                        <DataRow label="Exhaust" value={data.starboard?.exhaust} />
                        <DataRow label="Radiator" value={data.starboard?.radiator} />
                        <DataRow label="SW Temp" value={data.starboard?.sw_temp} />
                        <DataRow label="F.W COOLERS" value={data.starboard?.fw_coolers} />
                        <DataRow label="L.O COOLERS" value={data.starboard?.lo_coolers} />
                        
                        <SectionTitle className="bg-sky-600">GENERATOR</SectionTitle>
                        <DataRow label="L.O PRESS" value={data.generator?.lo_press} />
                        <DataRow label="F.W TEMP" value={data.generator?.fw_temp} />
                        <DataRow label="VOLTS" value={data.generator?.volts} />
                        <DataRow label="AMPERE" value={data.generator?.ampere} />
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-3">
                        <SectionTitle className="bg-amber-600">DAILY TANK</SectionTitle>
                        <HeaderRow labels={['BEFORE', 'AFTER']} />
                        <ValueRow values={[data.daily_tank?.before1, data.daily_tank?.after1]} />
                        <ValueRow values={[data.daily_tank?.before2, data.daily_tank?.after2]} />
                        <DataRow label="" value={data.daily_tank?.value1} />
                        <ValueRow values={[data.daily_tank?.before3, data.daily_tank?.after3]} />
                        <DataRow label="" value={data.daily_tank?.value2} />
                        <DataRow label="" value={data.daily_tank?.value3} />

                        <SectionTitle className="bg-purple-600">USED</SectionTitle>
                        <div className="space-y-3">
                            <HeaderRow labels={['BEFORE', 'AFTER']} />
                            <ValueRow values={[data.used?.before1, data.used?.after1]} />
                            <ValueRow values={[data.used?.before2, data.used?.after2]} />
                            <DataRow label="" value={data.used?.value1} />
                            <DataRow label="" value={data.used?.value2} />
                        </div>


                        <SectionTitle className="bg-slate-500">ROB</SectionTitle>
                        <DataRow label="" value={data.rob?.val1} />
                        <DataRow label="" value={data.rob?.val2} />
                        <DataRow label="" value={data.rob?.val3} />
                        <DataRow label="" value={data.rob?.val4} />
                        <DataRow label="" value={data.rob?.val5} />
                        
                         <div className="pt-4 space-y-2">
                            <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user?.date}</div>
                            <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user?.name}</div>
                            <div className="bg-card-foreground/5 h-8 text-center font-semibold flex items-center justify-center rounded-md">{data.user?.position}</div>
                        </div>
                    </div>
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
