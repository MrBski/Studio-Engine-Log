'use client';

import React, { useEffect } from 'react';
import { useForm, Controller }
from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { usePerforma } from '@/hooks/use-app';
import { Save } from 'lucide-react';
import { format } from 'date-fns';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-center bg-muted/50 p-2 my-2 rounded-md text-foreground text-sm">
    {children}
  </h3>
);

const DataRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex items-center">
        <label className="w-1/2 font-medium text-sm text-muted-foreground">{label}</label>
        {children}
    </div>
);

const HeaderRow = ({ labels }: { labels: string[] }) => (
    <div className="flex">
        <div className="w-1/2"></div>
        {labels.map(label => <div key={label} className="w-1/4 text-center font-bold text-sm text-muted-foreground">{label}</div>)}
    </div>
);


export default function PreviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPerformaRecord } = usePerforma();
  
  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      datetime: '',
      portside: { rpm: 1000.0, lo_press: 0.4, exhaust: 250260.0, radiator: 64.0, sw_temp: 31.0, fw_coolers: 6866.0, lo_coolers: 7470.0 },
      starboard: { rpm: 1000.0, lo_press: 0.4, exhaust: 260240.0, radiator: 65.0, sw_temp: 32.0, fw_coolers: 6867.0, lo_coolers: 7571.0 },
      generator: { lo_press: 0.36, fw_temp: 69.00, volts: 400.00, ampere: 10.00 },
      daily_tank: { before1: 71.0, after1: 77.5, before2: 1491.0, after2: 1627.5, value1: 136.5, before3: 1250.0, after3: 1410.0, value2: 160.0, value3: 23.5 },
      used: { before1: 77.0, after1: 71.0, before2: 1617.0, after2: 1491.0, value1: 31.5, value2: 32 },
      rob: { val1: 113368, val2: 113336, val3: 113400, val4: 113304, val5: 113272 },
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
      const performaData = {
        nama: `Engine Log - ${format(new Date(data.datetime), 'yyyy-MM-dd HH:mm')}`,
        tanggal: new Date(data.datetime).toISOString(),
        keterangan: JSON.stringify(data),
        jumlah: 1, // Represents one log entry
      };

      addPerformaRecord(performaData);

      toast({
        title: 'Log Saved!',
        description: 'The engine log has been saved as a JSON record.',
      });
      router.push('/performa');
    } catch (error) {
      console.error("Failed to save log:", error);
      toast({
        variant: "destructive",
        title: 'Error Saving Log',
        description: 'Could not save the log. Please try again.',
      });
    }
  };

  const renderInput = (name: any) => (
    <Input {...register(name, {valueAsNumber: true})} type="number" step="0.1" className="bg-card-foreground/5 h-8 text-right text-sm" />
  );

  return (
    <div className="space-y-4 pb-8">
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Engine Log Sheet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <Controller
                        name="datetime"
                        control={control}
                        render={({ field }) => <Input {...field} type="datetime-local" className="font-bold text-center text-lg h-12" />}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* LEFT COLUMN */}
                        <div className="space-y-3">
                            <SectionTitle>M. E PORTSIDE</SectionTitle>
                            <DataRow label="RPM">{renderInput('portside.rpm')}</DataRow>
                            <DataRow label="L. O PRESS">{renderInput('portside.lo_press')}</DataRow>
                            <DataRow label="Exhaust">{renderInput('portside.exhaust')}</DataRow>
                            <DataRow label="Radiator">{renderInput('portside.radiator')}</DataRow>
                            <DataRow label="SW Temp">{renderInput('portside.sw_temp')}</DataRow>
                            <DataRow label="F.W COOLERS">{renderInput('portside.fw_coolers')}</DataRow>
                            <DataRow label="L.O COOLERS">{renderInput('portside.lo_coolers')}</DataRow>

                            <SectionTitle>M. E STARBOARD</SectionTitle>
                            <DataRow label="RPM">{renderInput('starboard.rpm')}</DataRow>
                            <DataRow label="L. O PRESS">{renderInput('starboard.lo_press')}</DataRow>
                            <DataRow label="Exhaust">{renderInput('starboard.exhaust')}</DataRow>
                            <DataRow label="Radiator">{renderInput('starboard.radiator')}</DataRow>
                            <DataRow label="SW Temp">{renderInput('starboard.sw_temp')}</DataRow>
                            <DataRow label="F.W COOLERS">{renderInput('starboard.fw_coolers')}</DataRow>
                            <DataRow label="L.O COOLERS">{renderInput('starboard.lo_coolers')}</DataRow>
                            
                            <SectionTitle>GENERATOR</SectionTitle>
                            <DataRow label="L.O PRESS">{renderInput('generator.lo_press')}</DataRow>
                            <DataRow label="F.W TEMP">{renderInput('generator.fw_temp')}</DataRow>
                            <DataRow label="VOLTS">{renderInput('generator.volts')}</DataRow>
                            <DataRow label="AMPERE">{renderInput('generator.ampere')}</DataRow>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-3">
                            <SectionTitle>DAILY TANK</SectionTitle>
                            <HeaderRow labels={['BEFORE', 'AFTER']} />
                            <div className="flex items-center gap-2">
                                <div className="w-1/2"></div>
                                <div className="w-1/4">{renderInput('daily_tank.before1')}</div>
                                <div className="w-1/4">{renderInput('daily_tank.after1')}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1/2"></div>
                                <div className="w-1/4">{renderInput('daily_tank.before2')}</div>
                                <div className="w-1/4">{renderInput('daily_tank.after2')}</div>
                            </div>
                            <DataRow label="">{renderInput('daily_tank.value1')}</DataRow>
                            <div className="flex items-center gap-2">
                                <div className="w-1/2"></div>
                                <div className="w-1/4">{renderInput('daily_tank.before3')}</div>
                                <div className="w-1/4">{renderInput('daily_tank.after3')}</div>
                            </div>
                            <DataRow label="">{renderInput('daily_tank.value2')}</DataRow>
                            <DataRow label="">{renderInput('daily_tank.value3')}</DataRow>

                            <SectionTitle>USED</SectionTitle>
                            <HeaderRow labels={['BEFORE', 'AFTER']} />
                            <div className="flex items-center gap-2">
                                <div className="w-1/2"></div>
                                <div className="w-1/4">{renderInput('used.before1')}</div>
                                <div className="w-1/4">{renderInput('used.after1')}</div>
                            </div>
                             <div className="flex items-center gap-2">
                                <div className="w-1/2"></div>
                                <div className="w-1/4">{renderInput('used.before2')}</div>
                                <div className="w-1/4">{renderInput('used.after2')}</div>
                            </div>
                            <DataRow label="">{renderInput('used.value1')}</DataRow>
                            <DataRow label="">{renderInput('used.value2')}</DataRow>

                            <SectionTitle>ROB</SectionTitle>
                            <DataRow label="">{renderInput('rob.val1')}</DataRow>
                            <DataRow label="">{renderInput('rob.val2')}</DataRow>
                            <DataRow label="">{renderInput('rob.val3')}</DataRow>
                            <DataRow label="">{renderInput('rob.val4')}</DataRow>
                            <DataRow label="">{renderInput('rob.val5')}</DataRow>
                            
                             <div className="pt-4 space-y-2">
                                <Input {...register('user.date')} className="bg-card-foreground/5 h-8 text-center font-semibold" />
                                <Input {...register('user.name')} className="bg-card-foreground/5 h-8 text-center font-semibold" />
                                <Input {...register('user.position')} className="bg-card-foreground/5 h-8 text-center font-semibold" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <SectionTitle>Condition</SectionTitle>
                        <Textarea {...register('condition')} className="text-center font-bold" />
                    </div>
                </CardContent>
            </Card>

            <div className="text-center pt-4">
                <Button type="submit" size="lg">
                    <Save className="mr-2 h-4 w-4" />
                    Save Log
                </Button>
            </div>
        </form>
    </div>
  );
}

    