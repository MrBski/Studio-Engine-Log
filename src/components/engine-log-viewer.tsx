

'use client';

import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-bold text-center p-1.5 my-2 rounded-md text-primary-foreground text-xs", className)}>
    {children}
  </h3>
);

const DataRow = ({ label, value, className, valueClassName }: { label: string, value: any, className?: string, valueClassName?: string }) => {
    const displayValue = (val: any) => {
        if (val === null || val === undefined || val === '' || (typeof val === 'number' && isNaN(val))) return 'N/A';
        if (typeof val === 'number') {
           const fixedVal = val.toFixed(1).replace('.', ',');
           return fixedVal;
        }
        return String(val);
    }
    return (
        <div className={cn("flex items-center border-b border-white/5 py-0.5", className)}>
            <label className="w-1/2 font-medium text-xs text-muted-foreground">{label}</label>
            <div className={cn("w-1/2 text-right font-mono text-xs font-semibold", valueClassName)}>{displayValue(value)}</div>
        </div>
    );
};

const DataGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-2 gap-x-2 border border-muted-foreground/50 p-1 rounded-sm", className)}>
        {children}
    </div>
)

const DataCell = ({ children, className, span = 1 }: { children: React.ReactNode, className?: string, span?: number }) => (
    <div className={cn("flex items-center justify-center text-xs font-mono font-semibold", 
        span === 2 && "col-span-2",
        className
    )}>
        {children}
    </div>
)


export function EngineLogViewer({ data }: { data: any }) {
  if (!data) return null;
  
  const parsedDate = data.datetime ? (typeof data.datetime === 'string' ? parseISO(data.datetime) : new Date(data.datetime)) : null;
  const formattedDateTime = parsedDate && isValid(parsedDate) ? format(parsedDate, "MM/dd/yyyy HH:mm") : 'N/A';
  const formattedDate = data.user?.date ? (isValid(parseISO(data.user.date)) ? format(parseISO(data.user.date), "MMMM d, yyyy") : data.user.date) : 'N/A';

  const flowmeterUsage = (data.flowmeter?.after ?? 0) - (data.flowmeter?.before ?? 0);
  const dailyUsageCm = (data.daily?.after ?? 0) - (data.daily?.before ?? 0);
  const dailyUsageLtrs = dailyUsageCm * 21;
  const usageDifference = dailyUsageLtrs - flowmeterUsage;
  const used4hoursCm = (data.onduty?.before ?? 0) - (data.daily?.before ?? 0);
  const hourlyUsageLtrs = (used4hoursCm / 4) * 21;
  const roundedHourlyUsage = Math.round(hourlyUsageLtrs);
  
  const rob = data.rob ?? 0;
  const robH1 = rob - roundedHourlyUsage;
  const robH2 = robH1 - roundedHourlyUsage;
  const robH3 = robH2 - roundedHourlyUsage;
  const robH4 = robH3 - roundedHourlyUsage;


  const renderExhaust = (exhaust1: number, exhaust2: number) => {
      const val1 = String(exhaust1?.toFixed(1) ?? '0,0').replace('.',',');
      const val2 = String(exhaust2?.toFixed(1) ?? '0,0').replace('.',',');
      return `${val1} / ${val2}`;
  }

  const renderCooler = (coolerIn: number, coolerOut: number) => {
    const val1 = String(coolerIn?.toFixed(1) ?? '0,0').replace('.',',');
    const val2 = String(coolerOut?.toFixed(1) ?? '0,0').replace('.',',');
    return `${val1} / ${val2}`;
  }

  return (
    <div className="space-y-2 pb-8 bg-card p-2 rounded-lg text-[10px]">
        <div className="font-bold text-center text-base h-8 flex items-center justify-center bg-muted/50 rounded-md">
            {formattedDateTime}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
            {/* Left Column */}
            <div className="space-y-2">
                {data.portside && (
                <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
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
                 <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
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
                <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
                    <SectionTitle className="bg-sky-600">Generator</SectionTitle>
                    <DataRow label="L.O. PRESS" value={data.generator.lo_press} />
                    <DataRow label="F.W. TEMP" value={data.generator.fw_temp} />
                    <DataRow label="VOLTS" value={data.generator.volts} />
                    <DataRow label="AMPERE" value={data.generator.ampere} />
                </div>
                )}
            </div>

            {/* Right Column */}
            <div className="space-y-2">
                {data.daily && (
                    <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
                        <SectionTitle className="bg-gray-500">DAILY TANK</SectionTitle>
                        <DataGrid>
                           <DataCell className="text-muted-foreground">BEFORE</DataCell>
                           <DataCell className="text-muted-foreground">AFTER</DataCell>
                           <DataCell>{(data.daily.before ?? 0).toFixed(1).replace('.',',')}</DataCell>
                           <DataCell>{(data.daily.after ?? 0).toFixed(1).replace('.',',')}</DataCell>
                           <DataCell>{((data.daily.before ?? 0) * 21).toFixed(1).replace('.',',')}</DataCell>
                           <DataCell>{((data.daily.after ?? 0) * 21).toFixed(1).replace('.',',')}</DataCell>
                           <DataCell span={2} className="bg-purple-800/50 h-6 rounded-sm">{(dailyUsageCm).toFixed(1).replace('.',',')} cm</DataCell>
                           <DataCell span={2} className="bg-purple-800/50 h-6 rounded-sm mt-1">{(dailyUsageLtrs).toFixed(1).replace('.',',')} ltrs</DataCell>
                        </DataGrid>
                    </div>
                )}
                
                {data.flowmeter && (
                    <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
                        <SectionTitle className="bg-cyan-500">FLOWMETER</SectionTitle>
                        <DataGrid>
                           <DataCell>{(data.flowmeter.before ?? 0).toFixed(1).replace('.',',')}</DataCell>
                           <DataCell>{(data.flowmeter.after ?? 0).toFixed(1).replace('.',',')}</DataCell>
                           <DataCell span={2} className="bg-green-800/50 h-6 rounded-sm">{(flowmeterUsage).toFixed(1).replace('.',',')}</DataCell>
                        </DataGrid>
                    </div>
                )}
                
                <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
                    <SectionTitle className="bg-yellow-600">Difference</SectionTitle>
                    <DataGrid className='border-none'>
                        <DataCell span={2} className="bg-yellow-600/50 h-6 rounded-sm">{(usageDifference).toFixed(1).replace('.',',')}</DataCell>
                    </DataGrid>
                </div>


                {data.daily && data.onduty && (
                    <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
                        <div className="space-y-1 p-1">
                            <SectionTitle className="bg-blue-800">Pemakaian Per Jam</SectionTitle>
                             <DataGrid className="border-none">
                                <DataCell span={2} className="bg-blue-800/50 h-6 rounded-sm">{(hourlyUsageLtrs).toFixed(2).replace('.',',')} ltrs/jam</DataCell>
                            </DataGrid>
                            <SectionTitle className="bg-blue-800 mt-2">Pembulatan</SectionTitle>
                             <DataGrid className="border-none">
                                <DataCell span={2} className="bg-blue-800/50 h-6 rounded-sm">{(roundedHourlyUsage).toFixed(2).replace('.',',')} ltrs/jam</DataCell>
                            </DataGrid>
                        </div>
                    </div>
                )}
                
                <div className="space-y-1 p-1 border border-muted-foreground/50 rounded-sm">
                    <SectionTitle className="bg-gray-700">USED</SectionTitle>
                    <div className="grid grid-cols-2">
                        <div className="bg-green-500 text-black font-bold text-lg flex items-center justify-center rounded-l-sm">
                            <div className="text-center">
                                <p className="border-b border-black">{(rob).toFixed(0)}</p>
                            </div>
                        </div>
                        <div className="flex flex-col text-right">
                            <DataCell className="bg-rose-100/10 h-6 border-b border-muted-foreground/20">{robH1.toFixed(0)}</DataCell>
                            <DataCell className="bg-rose-100/10 h-6 border-b border-muted-foreground/20">{robH2.toFixed(0)}</DataCell>
                            <DataCell className="bg-rose-100/10 h-6 border-b border-muted-foreground/20">{robH3.toFixed(0)}</DataCell>
                            <DataCell className="bg-rose-100/10 h-6">{robH4.toFixed(0)}</DataCell>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="space-y-1 pt-2">
            {data.user && (
                <div className="text-center space-y-0.5">
                    <div className="h-6 text-center font-semibold flex items-center justify-center rounded-md bg-orange-200/20 text-orange-300">{formattedDate}</div>
                    <div className="h-6 text-center font-semibold flex items-center justify-center rounded-md bg-orange-200/20 text-orange-300">{data.user.name}</div>
                    <div className="h-6 text-center font-semibold flex items-center justify-center rounded-md bg-orange-200/20 text-orange-300">{data.user.position}</div>
                </div>
            )}
            {data.condition && (
                <div className="text-center font-bold p-2 rounded-md bg-orange-600/80 min-h-[40px] flex items-center justify-center text-lg mt-2">
                    {data.condition}
                </div>
            )}
        </div>
    </div>
  );
}
