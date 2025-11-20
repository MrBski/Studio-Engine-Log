import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gdjvefevmvrkcqdouvhb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkanZlZmV2bXZya2NxZG91dmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzE2NjIsImV4cCI6MjA3OTE0NzY2Mn0.XqXQhOVS6_I9FKpP81OYZhms_GKZypAcI_8uLER1yLg'
export const supabase = createClient(supabaseUrl, supabaseKey)