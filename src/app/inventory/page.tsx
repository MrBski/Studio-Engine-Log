'use client';

import { useInventory } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, Archive } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { InventoryItem, InventoryCategory } from '@/lib/types';
import { useState, useMemo, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  quantity: z.coerce.number().min(0, { message: "Quantity can't be negative." }),
  unit: z.string().min(1, { message: "Unit is required." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  category: z.enum(['ME', 'AE', 'Others'], { required_error: "Category is required." }),
});

function InventoryForm({ item, onSave, defaultCategory }: { item?: InventoryItem, onSave: (values: z.infer<typeof formSchema>) => void, defaultCategory: InventoryCategory }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: item || { name: '', quantity: 0, unit: '', location: '', category: defaultCategory },
  });

  useEffect(() => {
    form.reset(item || { name: '', quantity: 0, unit: '', location: '', category: defaultCategory });
  }, [item, form, defaultCategory]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl><Input placeholder="e.g., Spare Piston" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl><Input placeholder="e.g., pieces" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input placeholder="e.g., Engine Store" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Save</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}

const InventoryList = ({ items, onEdit, onDelete }: { items: InventoryItem[], onEdit: (item: InventoryItem) => void, onDelete: (id: string) => void }) => {
  if (items.length === 0) {
    return <p className="text-muted-foreground col-span-full text-center py-8">No inventory items found in this category.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-6">
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.location}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-3xl font-bold">{item.quantity} <span className="text-lg font-medium text-muted-foreground">{item.unit}</span></p>
            <p className="text-xs text-muted-foreground pt-2">Last updated: {new Date(item.timestamp).toLocaleDateString()}</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
             <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
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
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventory();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<InventoryCategory>("ME");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      updateInventoryItem({ ...editingItem, ...values });
    } else {
      addInventoryItem(values);
    }
    setOpenDialog(false);
    setEditingItem(undefined);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setOpenDialog(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setOpenDialog(true);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => item.category === activeTab);
  }, [inventory, activeTab]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
            <Archive className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Inventory List</h2>
            </div>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New
                </Button>
            </DialogTrigger>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InventoryCategory)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ME">Spare Part ME</TabsTrigger>
            <TabsTrigger value="AE">Spare Part AE</TabsTrigger>
            <TabsTrigger value="Others">Others</TabsTrigger>
            </TabsList>
            <TabsContent value="ME">
            <InventoryList items={filteredInventory} onEdit={handleEdit} onDelete={deleteInventoryItem} />
            </TabsContent>
            <TabsContent value="AE">
            <InventoryList items={filteredInventory} onEdit={handleEdit} onDelete={deleteInventoryItem} />
            </TabsContent>
            <TabsContent value="Others">
            <InventoryList items={filteredInventory} onEdit={handleEdit} onDelete={deleteInventoryItem} />
            </TabsContent>
        </Tabs>
        </div>

        <DialogContent>
            <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
                {editingItem ? 'Update the details for this inventory item.' : 'Fill in the details for the new inventory item.'}
            </DialogDescription>
            </DialogHeader>
            <InventoryForm item={editingItem} onSave={handleSave} defaultCategory={activeTab} />
        </DialogContent>
    </Dialog>
  );
}
