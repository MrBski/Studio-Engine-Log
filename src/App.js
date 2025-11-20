import React from 'react';
import LogForm from './components/LogForm';
import './lib/sync'; // sinkronisasi otomatis saat online

function App() {
  return (
    <div className="App">
      <h1>Engine Log</h1>
      <LogForm operator="Operator1" />
    </div>
  );
}

export default App;
