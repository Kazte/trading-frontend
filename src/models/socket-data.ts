import type { Trade } from './trade';

export interface SocketData {
  topic: string;
  symbol: string;
  data: Trade[];
}
