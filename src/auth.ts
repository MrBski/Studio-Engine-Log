import { supabase } from './supabaseClient'

export async function login(username: string, password: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single()
  if (error || !data) {
    throw new Error('Login gagal!')
  }
  // Simpan id user ke local (kode untuk local storage disesuaikan platform)
  localStorage.setItem('user_id', data.id)
  return data
}