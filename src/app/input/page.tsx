'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { usePerforma } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
  nama: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  tanggal: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'A valid date is required.' }),
  keterangan: z.string().optional(),
  jumlah: z.coerce.number().min(0, { message: 'Quantity cannot be negative.' }),
});

export default function InputPage() {
  const router = useRouter();
  const { addPerformaRecord } = usePerforma();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: '',
      jumlah: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addPerformaRecord(values);
    toast({
      title: 'Data Saved!',
      description: `Record "${values.nama}" has been successfully saved.`,
    });
    form.reset({ nama: '', tanggal: new Date().toISOString().split('T')[0], keterangan: '', jumlah: 0 });
    router.push('/performa');
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-2">
        <PlusCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-headline font-bold text-foreground">Input Performa Data</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Performa Record</CardTitle>
          <CardDescription>Fill out the form below to add a new performa record.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter record name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="jumlah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity / Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 120.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any relevant notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg">Save Record</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
