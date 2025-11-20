import React, { useState } from 'react';
import { saveLogOffline } from '../lib/offlineStorage';
import { v4 as uuidv4 } from 'uuid';

export default function LogForm({ operator }) {
  const [rpm, setRpm] = useState('');
  const [temp, setTemp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const log = {
      id: uuidv4(),
      operator,
      shift: getCurrentShift(),
      timestamp: Date.now(),
      engineData: { rpm: parseInt(rpm), temperature: parseInt(temp) },
      synced: false
    };
    await saveLogOffline(log);
    alert('Log tersimpan offline!');
    setRpm('');
    setTemp('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="RPM" value={rpm} onChange={e => setRpm(e.target.value)} required/>
      <input type="number" placeholder="Temperature" value={temp} onChange={e => setTemp(e.target.value)} required/>
      <button type="submit">Simpan Log</button>
    </form>
  );
}

function getCurrentShift() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 4) return '00-04';
  if (hour >= 4 && hour < 8) return '04-08';
  if (hour >= 8 && hour < 12) return '08-12';
  if (hour >= 12 && hour < 16) return '12-16';
  if (hour >= 16 && hour < 20) return '16-20';
  return '20-00';
}
