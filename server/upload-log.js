import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_SERVICE_KEY'; // jangan taruh di frontend
const supabase = createClient(supabaseUrl, supabaseKey);

const CORRECT_PIN = '16011'; // ganti PIN sesuai kebutuhan

app.post('/upload-log', async (req, res) => {
  const { pin, log } = req.body;
  if (pin !== CORRECT_PIN) return res.status(401).json({ message: 'PIN salah!' });

  try {
    const { error } = await supabase.from('engine_logs').insert([log]);
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json({ message: 'Log berhasil diupload' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
