export interface CryptoAsset {
    id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    priceChange24h: number;
  }
  
  export interface UserTransaction {
    assetId: string;
    amount: number;
    buyPrice: number;
    date: Date;
  }