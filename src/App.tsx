import './App.css';

import { useCallback, useState } from 'react';

import type { Trade } from './models';
import { TradeChart } from './components/trade-chart';
import { useWebSocket } from './hooks/useWebSocket';

const App = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  const handleOnMessage = useCallback((data: Trade[]) => {
    setTrades((prevTrades) => [...prevTrades, ...data]);
  }, []);

  const handleOnError = useCallback((error: Event) => {
    console.error('WebSocket connection error:', error);
  }, []);

  const handleOnClose = useCallback((event: Event) => {
    console.warn('WebSocket connection closed:', event);
  }, []);

  const { connectionState } = useWebSocket({
    url: 'ws://localhost:8080/ws/trades',
    onMessage: handleOnMessage,
    onError: handleOnError,
    onClose: handleOnClose
  });
  return (
    <div className='container'>
      <h1>WebSocket connection state: {connectionState}</h1>
      <TradeChart trades={trades} />
    </div>
  );
};

export default App;
