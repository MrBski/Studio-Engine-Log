import { supabase } from './supabaseClient'

export async function insertInventaris({ item_name, jumlah, user_id }) {
  const { error } = await supabase
    .from('inventaris')
    .insert([
      { 
        item_name, 
        jumlah, 
        tanggal: new Date().toISOString(), // simpan tanggal/now
        user_id
      }
    ]);
  if (error) {
    throw error;
  }
  return true; // sukses simpan
}