import React, { useState } from 'react';
import { useHistory } from '@docusaurus/router';



const PASSWORD = '123456';

export default function DevelopersGate() {

  console.log('DevelopersGate rendered');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      // Try client-side navigation first
      try {
        history.push('/developers/intro');
      } catch {
        // Fallback to full page reload
        window.location.href = '/developers/intro';
      }
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', textAlign: 'center' }}>
      <h1>Interstellar Milestone Deliveries Area</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter password"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ padding: 8, width: '80%' }}
        />
        <br /><br />
        <button type="submit" style={{ padding: '8px 24px' }}>Enter</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}