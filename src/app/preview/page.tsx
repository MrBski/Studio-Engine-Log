'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { usePerforma } from '@/hooks/use-app';
import { Save, Camera as CameraIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { PerformaRecord } from '@/lib/types';

const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-bold text-center p-2 my-2 rounded-md text-primary-foreground text-sm", className)}>
    {children}
  </h3>
);

const DataRow = ({ label, children, isHeader = false }: { label: string, children: React.ReactNode, isHeader?: boolean }) => (
    <div className="flex items-center">
        <label className={cn("w-1/2 font-medium text-sm", isHeader ? "text-muted-foreground" : "text-foreground")}>{label}</label>
        {children}
    </div>
);

export default function PreviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPerformaRecord } = usePerforma();
  const printRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      datetime: '',
      portside: { rpm: 1200.0, lo_press: 0.4, exhaust: 350400.0, radiator: 68.0, sw_temp: 31.0, fw_coolers: 6765.0, lo_coolers: 7570.0 },
      starboard: { rpm: 1200.0, lo_press: 0.4, exhaust: 380380.0, radiator: 68.0, sw_temp: 31.0, fw_coolers: 6765.0, lo_coolers: 7571.0 },
      generator: { lo_press: 0.36, fw_temp: 70.0, volts: 380.0, ampere: 10.0 },
      flowmeter: { before: 29670.0, after: 29920.0 },
      daily: { before: 64.5, after: 77.0 },
      onduty: { before: 77.0 },
      rob: 45914.0,
      used4hours: 66.0,
      user: { date: '', name: 'Mr. Basuki', position: '3/E' },
      condition: 'Engine Room in Good condition'
    }
  });

  useEffect(() => {
    const now = new Date();
    setValue('datetime', format(now, "yyyy-MM-dd'T'HH:mm"));
    setValue('user.date', format(now, 'MMMM d, yyyy'));
  }, [setValue]);

  const onSubmit = (data: any) => {
    try {
      const performaData: Omit<PerformaRecord, 'id'> = {
        nama: `Engine Log - ${format(new Date(data.datetime), 'yyyy-MM-dd HH:mm')}`,
        tanggal: new Date(data.datetime).toISOString(),
        keterangan: JSON.stringify(data),
        jumlah: 1, // Represents one log entry
      };

      addPerformaRecord(performaData);

      toast({
        title: 'Log Saved!',
        description: 'The engine log has been saved.',
      });
      router.push('/last-record');
    } catch (error) {
      console.error("Failed to save log:", error);
      toast({
        variant: "destructive",
        title: 'Error Saving Log',
        description: 'Could not save the log. Please try again.',
      });
    }
  };

  const handleSaveToDevice = async () => {
    if (!printRef.current) {
        toast({
            variant: "destructive",
            title: 'Error',
            description: 'Could not capture the log sheet.',
        });
        return;
    }
    toast({
        title: 'Generating Image...',
        description: 'Please wait while the log sheet is being captured.',
    });
    try {
        const canvas = await html2canvas(printRef.current, { useCORS: true, scale: 2 });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
            const now = new Date();
            const fileName = `EngineLog_${format(now, 'yyyy-MM-dd_HH-mm-ss')}.png`;
            saveAs(blob, fileName);
            toast({
                title: 'Image Saved!',
                description: 'The log sheet has been saved to your device.',
            });
        }
    } catch (error) {
        console.error("Failed to save image:", error);
        toast({
            variant: "destructive",
            title: 'Error Saving Image',
            description: 'Could not generate the image. Please try again.',
        });
    }
  };

  const renderInput = (name: any) => (
    <Input {...register(name, {
        setValueAs: v => String(v).replace(',', '.') 
    })} type="tel" inputMode="decimal" className="bg-card-foreground/5 h-8 text-right text-sm" />
  );

  return (
    <div className="space-y-4 pb-8">
       <form onSubmit={handleSubmit(onSubmit)}>
          <div ref={printRef} className="bg-card p-4 rounded-lg">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-center">New Engine Log Sheet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm max-w-md mx-auto">
                      <Controller
                          name="datetime"
                          control={control}
                          render={({ field }) => <Input {...field} type="datetime-local" className="font-bold text-center text-lg h-12" />}
                      />
                      
                      <div className="space-y-3">
                          <SectionTitle className="bg-red-600">M.E Port Side</SectionTitle>
                          <DataRow label="RPM">{renderInput('portside.rpm')}</DataRow>
                          <DataRow label="L.O. PRESS">{renderInput('portside.lo_press')}</DataRow>
                          <DataRow label="Exhaust">{renderInput('portside.exhaust')}</DataRow>
                          <DataRow label="Radiator">{renderInput('portside.radiator')}</DataRow>
                          <DataRow label="SW Temp">{renderInput('portside.sw_temp')}</DataRow>
                          <DataRow label="F.W. COOLERS">{renderInput('portside.fw_coolers')}</DataRow>
                          <DataRow label="L.O. COOLERS">{renderInput('portside.lo_coolers')}</DataRow>
                      </div>

                      <div className="space-y-3">
                          <SectionTitle className="bg-green-600">M.E Starboard</SectionTitle>
                          <DataRow label="RPM">{renderInput('starboard.rpm')}</DataRow>
                          <DataRow label="L.O. PRESS">{renderInput('starboard.lo_press')}</DataRow>
                          <DataRow label="Exhaust">{renderInput('starboard.exhaust')}</DataRow>
                          <DataRow label="Radiator">{renderInput('starboard.radiator')}</DataRow>
                          <DataRow label="SW Temp">{renderInput('starboard.sw_temp')}</DataRow>
                          <DataRow label="F.W. COOLERS">{renderInput('starboard.fw_coolers')}</DataRow>
                          <DataRow label="L.O. COOLERS">{renderInput('starboard.lo_coolers')}</DataRow>
                      </div>

                      <div className="space-y-3">
                          <SectionTitle className="bg-sky-600">Generator</SectionTitle>
                          <DataRow label="L.O. PRESS">{renderInput('generator.lo_press')}</DataRow>
                          <DataRow label="F.W. TEMP">{renderInput('generator.fw_temp')}</DataRow>
                          <DataRow label="VOLTS">{renderInput('generator.volts')}</DataRow>
                          <DataRow label="AMPERE">{renderInput('generator.ampere')}</DataRow>
                      </div>
                      
                      <div className="space-y-3">
                          <SectionTitle className="bg-amber-600">Flowmeter</SectionTitle>
                          <DataRow label="Before">{renderInput('flowmeter.before')}</DataRow>
                          <DataRow label="After">{renderInput('flowmeter.after')}</DataRow>
                      </div>

                      <div className="space-y-3">
                          <SectionTitle className="bg-purple-600">Daily</SectionTitle>
                          <DataRow label="Before">{renderInput('daily.before')}</DataRow>
                          <DataRow label="After">{renderInput('daily.after')}</DataRow>
                      </div>
                      
                      <div className="space-y-3">
                          <SectionTitle className="bg-cyan-600">On Duty</SectionTitle>
                          <DataRow label="Before">{renderInput('onduty.before')}</DataRow>
                      </div>
                      
                      <div className="space-y-3">
                         <SectionTitle className="bg-slate-500">Other</SectionTitle>
                          <DataRow label="RoB">{renderInput('rob')}</DataRow>
                          <DataRow label="USED 4 Hours">{renderInput('used4hours')}</DataRow>
                      </div>
                      
                      <div className="pt-4 space-y-2">
                         <SectionTitle className="bg-muted text-muted-foreground">On Duty Engineer</SectionTitle>
                         <Input {...register('user.date')} className="bg-card-foreground/5 h-8 text-center font-semibold" />
                         <Input {...register('user.name')} className="bg-card-foreground/5 h-8 text-center font-semibold" />
                         <Input {...register('user.position')} className="bg-card-foreground/5 h-8 text-center font-semibold" />
                     </div>
                      
                      <div className="pt-4">
                          <SectionTitle className="bg-muted text-muted-foreground">Condition</SectionTitle>
                          <Textarea {...register('condition')} className="text-center font-bold" />
                      </div>
                  </CardContent>
              </Card>
          </div>
          
          <div className="text-center pt-4 flex justify-center gap-2">
              <Button type="button" size="lg" variant="outline" onClick={handleSaveToDevice}>
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Save to Device
              </Button>
              <Button type="submit" size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  Save Log
              </Button>
          </div>
      </form>
    </div>
  );
}
