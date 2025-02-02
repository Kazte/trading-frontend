import { useEffect, useRef, useState } from 'react';

import type { Trade } from '../models';
import { messageAdapter } from '../adapters/message.adapter';

interface WebSocketOptions {
  url: string;
  onMessage: (data: Trade[]) => void;
  onError: (error: Event) => void;
  onClose: (event: CloseEvent) => void;
}

// connection states

enum ConnectionStates {
  Connecting = 'CONNECTING',
  Open = 'OPEN',
  Closed = 'CLOSED'
}

export function useWebSocket(options: WebSocketOptions) {
  const { url, onMessage, onError, onClose } = options;
  const [connectionState, setConnectionState] = useState<ConnectionStates>(
    ConnectionStates.Closed
  );
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url, 'echo-protocol');
    setConnectionState(ConnectionStates.Connecting);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionState(ConnectionStates.Open);
    };

    ws.onmessage = (event) => {
      const adaptedData = messageAdapter(event.data);
      onMessage(adaptedData);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError(error);
    };

    ws.onclose = (e) => {
      setConnectionState(ConnectionStates.Closed);
      onClose(e);
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [url, onMessage, onerror, onClose]);

  function sendMessage(message: string) {
    if (connectionState !== ConnectionStates.Open || !wsRef.current) {
      console.error('WebSocket is not connected');
      return;
    }

    wsRef.current.send(JSON.stringify(message));
  }

  return { sendMessage, connectionState };
}
