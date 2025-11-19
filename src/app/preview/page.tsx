'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { usePerforma, useSettings } from '@/hooks/use-app';
import { Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { PerformaRecord } from '@/lib/types';
import { EngineLogViewer } from '@/components/engine-log-viewer';
import { SnapshotButton } from '@/components/snapshot-button';

const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-bold text-center p-2 my-2 rounded-md text-primary-foreground text-sm", className)}>
    {children}
  </h3>
);

const DataRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center">
    <label className="w-1/2 font-medium text-sm">{label}</label>
    {children}
  </div>
);

export default function PreviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPerformaRecord } = usePerforma();
  const { settings } = useSettings();
  const { dailyTankMultiplier, engineerName, engineerPosition } = settings;
  const printRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const defaultValues = {
    datetime: '',
    portside: { rpm: 0, lo_press: 0, exhaust1: 0, exhaust2: 0, radiator: 0, sw_temp: 0, fw_coolers_in: 0, fw_coolers_out: 0, lo_coolers_in: 0, lo_coolers_out: 0 },
    starboard: { rpm: 0, lo_press: 0, exhaust1: 0, exhaust2: 0, radiator: 0, sw_temp: 0, fw_coolers_in: 0, fw_coolers_out: 0, lo_coolers_in: 0, lo_coolers_out: 0 },
    generator: { lo_press: 0, fw_temp: 0, volts: 0, ampere: 0 },
    flowmeter: { before: 0, after: 0 },
    daily: { before: 0, after: 0 },
    onduty: { before: 0 },
    rob: 0,
    used4hours: 0,
    rob4hours: { hour1: 0, hour2: 0, hour3: 0, hour4: 0 },
    user: { date: '', name: engineerName, position: engineerPosition },
    condition: 'Engine Room in Good condition'
  };

  const { register, handleSubmit, setValue, control, watch } = useForm({ defaultValues });

  const watchedValues = watch();
  const ondutyBefore = watch('onduty.before');
  const dailyBefore = watch('daily.before');
  const rob = watch('rob');
  const used4hours = watch('used4hours');

  useEffect(() => {
    const now = new Date();
    setValue('datetime', format(now, "yyyy-MM-dd'T'HH:mm"));
    setValue('user.date', format(now, 'MMMM d, yyyy'));
    setValue('user.name', engineerName);
    setValue('user.position', engineerPosition);
  }, [setValue, engineerName, engineerPosition]);

  useEffect(() => {
    const onduty = parseFloat(String(ondutyBefore).replace(',', '.')) || 0;
    const daily = parseFloat(String(dailyBefore).replace(',', '.')) || 0;
    const used = onduty - daily;
    setValue('used4hours', used);
  }, [ondutyBefore, dailyBefore, setValue]);

  useEffect(() => {
    const hourlyUsageCm = (parseFloat(String(used4hours).replace(',', '.')) || 0) / 4;
    const hourlyUsageLtrs = hourlyUsageCm * dailyTankMultiplier;
    const rounded = Math.round(hourlyUsageLtrs);

    const r = parseFloat(String(rob)) || 0;

    setValue('rob4hours', {
      hour1: r - rounded,
      hour2: r - rounded * 2,
      hour3: r - rounded * 3,
      hour4: r - rounded * 4,
    });
  }, [used4hours, rob, setValue, dailyTankMultiplier]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && formRef.current) {
      e.preventDefault();

      const form = formRef.current;
      const focusable = Array.from(form.querySelectorAll("input, textarea")) as (HTMLInputElement | HTMLTextAreaElement)[];
      const index = focusable.indexOf(e.currentTarget as any);

      if (index > -1 && index < focusable.length - 1) {
        const next = focusable[index + 1];
        next.focus();

        setTimeout(() => {
          next.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
      }
    }
  };

  const renderInput = (name: any) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          type="tel"
          inputMode="decimal"
          className="bg-card-foreground/5 h-8 text-right text-sm"
          onKeyDown={handleKeyDown}
          value={field.value === 0 ? "" : field.value}
          onChange={(e) => {
            const val = e.target.value;
            if (val.trim() === "") return field.onChange(0);
            field.onChange(Number(val.replace(",", ".")));
          }}
        />
      )}
    />
  );

  const renderReadOnlyInput = (name: any) => (
    <Input {...register(name)} type="tel" className="bg-card-foreground/10 h-8 text-right text-sm font-bold" readOnly />
  );

  const onSubmit = (data: any) => {
    try {
      const performaData: Omit<PerformaRecord, 'id'> = {
        nama: `Engine Log - ${format(new Date(data.datetime), 'yyyy-MM-dd HH:mm')}`,
        tanggal: new Date(data.datetime).toISOString(),
        keterangan: JSON.stringify(data),
        jumlah: 1,
      };

      addPerformaRecord(performaData);

      toast({ title: 'Log Saved!', description: 'The engine log has been saved.' });
      router.push('/last-record');
    } catch (error) {
      toast({ variant: "destructive", title: 'Error Saving Log', description: 'Could not save the log.' });
    }
  };

  if (!isClient) return null;

  return (
    <div className="space-y-4 pb-8">
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-card p-4 rounded-lg">
          <Card>
            <CardHeader><CardTitle className="text-center">New Engine Log Sheet</CardTitle></CardHeader>

            <CardContent className="space-y-4 text-sm max-w-md mx-auto">

              <Controller name="datetime" control={control}
                render={({ field }) => (
                  <Input {...field} type="datetime-local"
                    className="font-bold text-center text-lg h-12"
                    onKeyDown={handleKeyDown}
                  />
                )}
              />

              {/* SECTION PORTSIDE */}
              <div className="space-y-3">
                <SectionTitle className="bg-red-600">M.E Port Side</SectionTitle>
                <DataRow label="RPM">{renderInput('portside.rpm')}</DataRow>
                <DataRow label="L.O. PRESS">{renderInput('portside.lo_press')}</DataRow>
                <DataRow label="Exhaust 1">{renderInput('portside.exhaust1')}</DataRow>
                <DataRow label="Exhaust 2">{renderInput('portside.exhaust2')}</DataRow>
                <DataRow label="Radiator">{renderInput('portside.radiator')}</DataRow>
                <DataRow label="SW Temp">{renderInput('portside.sw_temp')}</DataRow>
                <DataRow label="F.W. COOLERS In">{renderInput('portside.fw_coolers_in')}</DataRow>
                <DataRow label="F.W. COOLERS Out">{renderInput('portside.fw_coolers_out')}</DataRow>
                <DataRow label="L.O. COOLERS In">{renderInput('portside.lo_coolers_in')}</DataRow>
                <DataRow label="L.O. COOLERS Out">{renderInput('portside.lo_coolers_out')}</DataRow>
              </div>

              {/* STARBOARD */}
              <div className="space-y-3">
                <SectionTitle className="bg-green-600">M.E Starboard</SectionTitle>
                <DataRow label="RPM">{renderInput('starboard.rpm')}</DataRow>
                <DataRow label="L.O. PRESS">{renderInput('starboard.lo_press')}</DataRow>
                <DataRow label="Exhaust 1">{renderInput('starboard.exhaust1')}</DataRow>
                <DataRow label="Exhaust 2">{renderInput('starboard.exhaust2')}</DataRow>
                <DataRow label="Radiator">{renderInput('starboard.radiator')}</DataRow>
                <DataRow label="SW Temp">{renderInput('starboard.sw_temp')}</DataRow>
                <DataRow label="F.W. COOLERS In">{renderInput('starboard.fw_coolers_in')}</DataRow>
                <DataRow label="F.W. COOLERS Out">{renderInput('starboard.fw_coolers_out')}</DataRow>
                <DataRow label="L.O. COOLERS In">{renderInput('starboard.lo_coolers_in')}</DataRow>
                <DataRow label="L.O. COOLERS Out">{renderInput('starboard.lo_coolers_out')}</DataRow>
              </div>

              {/* GENERATOR */}
              <div className="space-y-3">
                <SectionTitle className="bg-sky-600">Generator</SectionTitle>
                <DataRow label="L.O. PRESS">{renderInput('generator.lo_press')}</DataRow>
                <DataRow label="F.W. TEMP">{renderInput('generator.fw_temp')}</DataRow>
                <DataRow label="VOLTS">{renderInput('generator.volts')}</DataRow>
                <DataRow label="AMPERE">{renderInput('generator.ampere')}</DataRow>
              </div>

              {/* FLOWMETER */}
              <div className="space-y-3">
                <SectionTitle className="bg-amber-600">Flowmeter</SectionTitle>
                <DataRow label="Before">{renderInput('flowmeter.before')}</DataRow>
                <DataRow label="After">{renderInput('flowmeter.after')}</DataRow>
              </div>

              {/* DAILY */}
              <div className="space-y-3">
                <SectionTitle className="bg-purple-600">Daily</SectionTitle>
                <DataRow label="Before">{renderInput('daily.before')}</DataRow>
                <DataRow label="After">{renderInput('daily.after')}</DataRow>
              </div>

              {/* ON DUTY */}
              <div className="space-y-3">
                <SectionTitle className="bg-cyan-600">On Duty</SectionTitle>
                <DataRow label="Before">{renderInput('onduty.before')}</DataRow>
              </div>

              {/* OTHER */}
              <div className="space-y-3">
                <SectionTitle className="bg-slate-500">Other</SectionTitle>
                <DataRow label="RoB">{renderInput('rob')}</DataRow>
                <DataRow label="USED 4 Hours">{renderReadOnlyInput('used4hours')}</DataRow>
              </div>

              {/* USER SECTION */}
              <div className="pt-4 space-y-2">
                <SectionTitle className="bg-muted text-muted-foreground">On Duty Engineer</SectionTitle>
                <Input {...register('user.date')} className="bg-card-foreground/5 h-8 text-center font-semibold" onKeyDown={handleKeyDown} />
                <Input {...register('user.name')} className="bg-card-foreground/5 h-8 text-center font-semibold" onKeyDown={handleKeyDown} />
                <Input {...register('user.position')} className="bg-card-foreground/5 h-8 text-center font-semibold" onKeyDown={handleKeyDown} />
              </div>

              {/* CONDITION */}
              <div className="pt-4">
                <SectionTitle className="bg-muted text-muted-foreground">Condition</SectionTitle>
                <Textarea {...register('condition')} className="text-center font-bold" onKeyDown={handleKeyDown} />
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-4 flex justify-center gap-2">
          <SnapshotButton
            targetRef={printRef}
            fileNamePrefix="EngineLog"
            size="lg"
            variant="outline"
          />
          <Button type="submit" size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save Log
          </Button>
        </div>

      </form>

      <div className="pt-8 fixed -right-full top-0">
        <div ref={printRef}>
          <EngineLogViewer data={watchedValues} />
        </div>
      </div>

    </div>
  );
}
