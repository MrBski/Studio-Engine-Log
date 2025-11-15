'use client';

import { useInventory, usePerforma } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, Archive, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { InventoryItem, InventoryCategory, PerformaRecord } from '@/lib/types';
import { useState, useMemo, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const itemFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  quantity: z.coerce.number().min(0, { message: "Quantity can't be negative." }),
  unit: z.string().min(1, { message: "Unit is required." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  category: z.enum(['ME', 'AE', 'Others'], { required_error: "Category is required." }),
});

const amprahFormSchema = z.object({
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
  notes: z.string().optional(),
});

function InventoryForm({ item, onSave, defaultCategory }: { item?: InventoryItem, onSave: (values: z.infer<typeof itemFormSchema>) => void, defaultCategory: InventoryCategory }) {
  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: item || { name: '', quantity: 0, unit: '', location: '', category: defaultCategory },
  });

  useEffect(() => {
    form.reset(item || { name: '', quantity: 0, unit: '', location: '', category: defaultCategory });
  }, [item, form, defaultCategory]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ME">Spare Part ME</SelectItem>
                  <SelectItem value="AE">Spare Part AE</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl><Input placeholder="e.g., Spare Piston" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="quantity" render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="unit" render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl><Input placeholder="e.g., pieces" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input placeholder="e.g., Engine Store" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
            <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function AmprahForm({ item, onSave }: { item: InventoryItem, onSave: (values: z.infer<typeof amprahFormSchema>) => void }) {
    const form = useForm<z.infer<typeof amprahFormSchema>>({
        resolver: zodResolver(amprahFormSchema),
        defaultValues: { quantity: 1, notes: '' },
    });

    const onSubmit = (values: z.infer<typeof amprahFormSchema>) => {
        onSave(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <p>Item: <span className="font-semibold">{item.name}</span></p>
                <p>Current Stock: <span className="font-semibold">{item.quantity} {item.unit}</span></p>
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity to Use (Amprah)</FormLabel>
                            <FormControl><Input type="number" {...field} max={item.quantity} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., For monthly maintenance" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                  <Button type="submit">Submit Amprahan</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

const InventoryList = ({ items, onEdit, onDelete, onAmprah }: { items: InventoryItem[], onEdit: (item: InventoryItem) => void, onDelete: (id: string) => void, onAmprah: (item: InventoryItem) => void }) => {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No inventory items found in this category.</p>;
  }

  return (
    <div className="space-y-4 pt-6">
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardHeader className="flex-1">
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.location}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pt-6 sm:pt-6 sm:flex sm:justify-center">
            <div>
              <p className="text-2xl font-bold">{item.quantity} <span className="text-base font-medium text-muted-foreground">{item.unit}</span></p>
              <p className="text-xs text-muted-foreground pt-1">Last updated: {new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
          </CardContent>
          <CardFooter className="flex-1 flex justify-end gap-2 pt-0 sm:pt-6">
            <Button variant="outline" size="sm" onClick={() => onAmprah(item)}>
                <Send className="h-4 w-4 mr-2" /> Amprah
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item "{item.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default function InventoryPage() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, deductInventoryItem } = useInventory();
  const { addPerformaRecord } = usePerforma();
  const [dialogContent, setDialogContent] = useState<'newItem' | 'editItem' | 'amprah' | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<InventoryCategory>("ME");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveItem = (values: z.infer<typeof itemFormSchema>) => {
    if (dialogContent === 'editItem' && selectedItem) {
      updateInventoryItem({ ...selectedItem, ...values });
    } else {
      addInventoryItem(values);
    }
    setDialogContent(null);
  };
  
  const handleSaveAmprah = (values: z.infer<typeof amprahFormSchema>) => {
    if (selectedItem) {
        deductInventoryItem(selectedItem.id, values.quantity);
        
        const amprahRecord: Omit<PerformaRecord, 'id'> = {
            nama: `Amprahan: ${selectedItem.name}`,
            tanggal: new Date().toISOString(),
            keterangan: JSON.stringify({
                type: 'Amprahan',
                itemId: selectedItem.id,
                itemName: selectedItem.name,
                quantityUsed: values.quantity,
                unit: selectedItem.unit,
                notes: values.notes,
            }),
            jumlah: values.quantity,
        };
        addPerformaRecord(amprahRecord);
    }
    setDialogContent(null);
  };


  const handleAddNew = () => {
    setSelectedItem(undefined);
    setDialogContent('newItem');
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogContent('editItem');
  };
  
  const handleAmprah = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogContent('amprah');
  };


  const filteredInventory = useMemo(() => {
    return inventory.filter(item => item.category === activeTab);
  }, [inventory, activeTab]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  const getDialogContent = () => {
    switch (dialogContent) {
        case 'newItem':
            return {
                title: 'Add New Item',
                description: 'Fill in the details for the new inventory item.',
                content: <InventoryForm onSave={handleSaveItem} defaultCategory={activeTab} />
            };
        case 'editItem':
            return {
                title: 'Edit Item',
                description: 'Update the details for this inventory item.',
                content: <InventoryForm item={selectedItem} onSave={handleSaveItem} defaultCategory={activeTab} />
            };
        case 'amprah':
             return {
                title: 'Amprah Item',
                description: 'Record the usage of an inventory item.',
                content: selectedItem ? <AmprahForm item={selectedItem} onSave={handleSaveAmprah} /> : null
            };
        default:
            return null;
    }
  }
  
  const currentDialog = getDialogContent();

  return (
    <Dialog open={!!dialogContent} onOpenChange={(open) => !open && setDialogContent(null)}>
        <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
            <Archive className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Inventory List</h2>
            </div>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InventoryCategory)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ME">Spare Part ME</TabsTrigger>
            <TabsTrigger value="AE">Spare Part AE</TabsTrigger>
            <TabsTrigger value="Others">Others</TabsTrigger>
            </TabsList>
            <TabsContent value="ME">
                <InventoryList items={filteredInventory} onEdit={handleEdit} onDelete={deleteInventoryItem} onAmprah={handleAmprah} />
            </TabsContent>
            <TabsContent value="AE">
                <InventoryList items={filteredInventory} onEdit={handleEdit} onDelete={deleteInventoryItem} onAmprah={handleAmprah} />
            </TabsContent>
            <TabsContent value="Others">
                <InventoryList items={filteredInventory} onEdit={handleEdit} onDelete={deleteInventoryItem} onAmprah={handleAmprah} />
            </TabsContent>
        </Tabs>
        </div>

        {currentDialog && (
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentDialog.title}</DialogTitle>
                    <DialogDescription>{currentDialog.description}</DialogDescription>
                </DialogHeader>
                {currentDialog.content}
            </DialogContent>
        )}
    </Dialog>
  );
}
