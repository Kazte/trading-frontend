import type { Trade } from '../models';

const colorMap: { [key: string]: string } = {
  BTC_USDT: '#eb6f92',
  ETH_USDT: '#9ccfd8',
  XRP_USDT: '#c4a7e7',
  ADA_USDT: '#f6c177',
  DOGE_USDT: '#31748F'
};

export function messageAdapter(message: string): Trade[] {
  try {
    const parseData = JSON.parse(message);

    if (
      parseData &&
      Array.isArray(parseData.data) &&
      parseData.data.every(
        (item: Trade) =>
          'symbol' in item && 'timestamp' in item && 'price' in item
      )
    ) {
      return parseData.data.map((trade: Trade) => ({
        ...trade,
        color: colorMap[trade.symbol] || '#000000'
      }));
    }

    console.error('Invalid message format', message);
    return [];
  } catch (e) {
    console.error('Error parsing message', e);
    return [];
  }
}
