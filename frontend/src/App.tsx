import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Button } from '@/components/Button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>NotesVault Frontend</h1>
      <p>React + TypeScript + Vite</p>
      <div className="card">
        <Button label={`Count is ${count}`} onClick={() => setCount((count) => count + 1)} />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Path aliases working! Imported Button from @/components</p>
    </>
  );
}

export default App;
