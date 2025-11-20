import { supabase } from './supabaseClient'

export async function fetchInventaris(userId: string) {
  const { data, error } = await supabase
    .from('inventaris')
    .select('*')
    .eq('user_id', userId)             // hanya ambil milik si user itu
    .order('tanggal', { ascending: false }) // urutkan dari terbaru

  if (error) {
    throw error;
  }
  return data; // tampilkan ke UI/aplikasi
}