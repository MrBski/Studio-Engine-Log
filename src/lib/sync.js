import { getUnsyncedLogs, markLogAsSynced } from './offlineStorage';

export async function syncLogsToCloud(pin) {
  const logs = await getUnsyncedLogs();
  for (let log of logs) {
    try {
      const response = await fetch('http://localhost:3001/upload-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, log })
      });
      const result = await response.json();
      if (response.ok) await markLogAsSynced(log.id);
      else console.error(result.message);
    } catch (err) {
      console.error('Gagal sinkron:', err);
    }
  }
}

// jalankan otomatis saat online
window.addEventListener('online', () => {
  const pin = prompt('Masukkan PIN untuk sinkronisasi:');
  syncLogsToCloud(pin);
});
