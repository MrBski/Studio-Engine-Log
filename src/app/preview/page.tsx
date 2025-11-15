
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
import { EngineLogViewer } from '@/components/engine-log-viewer';

const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-bold text-center p-2 my-2 rounded-md text-primary-foreground text-sm", className)}>
    {children}
  </h3>
);

const DataRow = ({ label, children, isHeader = false }: { label:string, children:React.ReactNode, isHeader?: boolean }) => (
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
  const formRef = useRef<HTMLFormElement>(null);
  
  const defaultValues = {
    datetime: '',
    portside: { rpm: 1200.0, lo_press: 0.4, exhaust1: 350.0, exhaust2: 400.0, radiator: 68.0, sw_temp: 31.0, fw_coolers_in: 6765.0, fw_coolers_out: 6760.0, lo_coolers_in: 7570.0, lo_coolers_out: 7565.0 },
    starboard: { rpm: 1200.0, lo_press: 0.4, exhaust1: 380.0, exhaust2: 380.0, radiator: 68.0, sw_temp: 31.0, fw_coolers_in: 6765.0, fw_coolers_out: 6760.0, lo_coolers_in: 7571.0, lo_coolers_out: 7566.0 },
    generator: { lo_press: 0.36, fw_temp: 70.0, volts: 380.0, ampere: 10.0 },
    flowmeter: { before: 29670.0, after: 29920.0 },
    daily: { before: 64.5, after: 77.0 },
    onduty: { before: 77.0 },
    rob: 45914.0,
    used4hours: 0,
    rob4hours: { hour1: 0, hour2: 0, hour3: 0, hour4: 0},
    user: { date: '', name: 'Mr. Basuki', position: '3/E' },
    condition: 'Engine Room in Good condition'
  };

  const { register, handleSubmit, setValue, control, watch } = useForm({
    defaultValues
  });
  
  const watchedValues = watch();
  const ondutyBefore = watch('onduty.before');
  const dailyBefore = watch('daily.before');
  const rob = watch('rob');

  useEffect(() => {
    const now = new Date();
    setValue('datetime', format(now, "yyyy-MM-dd'T'HH:mm"));
    setValue('user.date', format(now, 'MMMM d, yyyy'));
  }, [setValue]);

  useEffect(() => {
    const onduty = parseFloat(String(ondutyBefore).replace(',', '.')) || 0;
    const daily = parseFloat(String(dailyBefore).replace(',', '.')) || 0;
    const used = onduty - daily;
    setValue('used4hours', used);

    const hourlyUsageLiters = (used / 4) * 21;
    const initialRob = parseFloat(String(rob).replace(',', '.')) || 0;
    
    const h1 = initialRob - hourlyUsageLiters;
    const h2 = h1 - hourlyUsageLiters;
    const h3 = h2 - hourlyUsageLiters;
    const h4 = h3 - hourlyUsageLiters;

    setValue('rob4hours', {
        hour1: h1,
        hour2: h2,
        hour3: h3,
        hour4: h4,
    });

  }, [ondutyBefore, dailyBefore, rob, setValue]);


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
    const elementToCapture = printRef.current;
    if (!elementToCapture) {
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

    const originalStyle = {
      maxHeight: elementToCapture.style.maxHeight,
      overflowY: elementToCapture.style.overflowY,
    };
    elementToCapture.style.maxHeight = 'none';
    elementToCapture.style.overflowY = 'visible';

    try {
        const canvas = await html2canvas(elementToCapture, { 
          useCORS: true, 
          scale: 2,
          backgroundColor: '#262A34', // Same as dark card
          height: elementToCapture.scrollHeight,
          windowHeight: elementToCapture.scrollHeight,
        });
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
    } finally {
      if(elementToCapture) {
        elementToCapture.style.maxHeight = originalStyle.maxHeight;
        elementToCapture.style.overflowY = originalStyle.overflowY;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && formRef.current) {
      e.preventDefault();
      const form = formRef.current;
      const focusable = Array.from(
        form.querySelectorAll('input, textarea')
      ) as (HTMLInputElement | HTMLTextAreaElement)[];
      const index = focusable.indexOf(e.currentTarget as (HTMLInputElement | HTMLTextAreaElement));
      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      }
    }
  };

  const renderInput = (name: any) => (
    <Input {...register(name, {
        setValueAs: v => parseFloat(String(v).replace(',', '.')) || 0
    })} type="tel" inputMode="decimal" className="bg-card-foreground/5 h-8 text-right text-sm" onKeyDown={handleKeyDown}/>
  );
  
  const renderReadOnlyInput = (name: any) => (
    <Input {...register(name)} type="tel" className="bg-card-foreground/10 h-8 text-right text-sm font-bold" readOnly />
  );

  return (
    <div className="space-y-4 pb-8">
       <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-card p-4 rounded-lg">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-center">New Engine Log Sheet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm max-w-md mx-auto">
                      <Controller
                          name="datetime"
                          control={control}
                          render={({ field }) => <Input {...field} type="datetime-local" className="font-bold text-center text-lg h-12" onKeyDown={handleKeyDown} />}
                      />
                      
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
                          <DataRow label="USED 4 Hours">{renderReadOnlyInput('used4hours')}</DataRow>
                      </div>
                      
                      <div className="pt-4 space-y-2">
                         <SectionTitle className="bg-muted text-muted-foreground">On Duty Engineer</SectionTitle>
                         <Input {...register('user.date')} className="bg-card-foreground/5 h-8 text-center font-semibold" onKeyDown={handleKeyDown}/>
                         <Input {...register('user.name')} className="bg-card-foreground/5 h-8 text-center font-semibold" onKeyDown={handleKeyDown}/>
                         <Input {...register('user.position')} className="bg-card-foreground/5 h-8 text-center font-semibold" onKeyDown={handleKeyDown}/>
                     </div>
                      
                      <div className="pt-4">
                          <SectionTitle className="bg-muted text-muted-foreground">Condition</SectionTitle>
                          <Textarea {...register('condition')} className="text-center font-bold" onKeyDown={handleKeyDown}/>
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

      <div className="pt-8 fixed -right-full top-0">
        <div ref={printRef}>
          <EngineLogViewer data={watchedValues} />
        </div>
      </div>
    </div>
  );

    