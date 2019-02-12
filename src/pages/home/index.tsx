import React from 'react';
import { useStore } from '../../store';

function Home() {
  const [state, dispatch] = useStore();

  return (
    <main>
      <h1>Test</h1>
      <p>{JSON.stringify(state)}</p>
    </main>
  );
}

export default Home;
