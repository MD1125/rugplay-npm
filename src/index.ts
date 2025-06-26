import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface Coin {
  symbol: string;
  name: string;
  icon: string;
  price?: number;
  currentPrice?: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  createdAt?: string;
  creatorName?: string;
}

export interface MarketDataResponse {
  coins: Coin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CoinDetailsResponse {
  coin: any;
  candlestickData: any[];
  volumeData: any[];
  timeframe: string;
}

export interface CoinHoldersResponse {
  coinSymbol: string;
  totalHolders: number;
  circulatingSupply: number;
  poolInfo: any;
  holders: any[];
}

export interface HopiumResponse {
  questions: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HopiumDetailsResponse {
  question: any;
  probabilityHistory: any[];
}

export class RugplayClient {
  private apiKey: string;
  private axios: AxiosInstance;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('API key is required');
    this.apiKey = apiKey;
    this.axios = axios.create({
      baseURL: 'https://rugplay.com',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async getTopCoins(): Promise<{ coins: Coin[] }> {
    return this._request('/api/v1/top');
  }

  async getMarketData(params: Record<string, any> = {}): Promise<MarketDataResponse> {
    return this._request('/api/v1/market', { params });
  }

  async getCoinDetails(symbol: string, timeframe?: string): Promise<CoinDetailsResponse> {
    if (!symbol) throw new Error('Symbol is required');
    const params = timeframe ? { timeframe } : undefined;
    return this._request(`/api/v1/coin/${encodeURIComponent(symbol)}`, { params });
  }

  async getCoinHolders(symbol: string, limit?: number): Promise<CoinHoldersResponse> {
    if (!symbol) throw new Error('Symbol is required');
    const params = limit ? { limit } : undefined;
    return this._request(`/api/v1/holders/${encodeURIComponent(symbol)}`, { params });
  }

  async getHopium(params: Record<string, any> = {}): Promise<HopiumResponse> {
    return this._request('/api/v1/hopium', { params });
  }

  async getHopiumDetails(questionId: number): Promise<HopiumDetailsResponse> {
    if (!questionId) throw new Error('Question ID is required');
    return this._request(`/api/v1/hopium/${encodeURIComponent(questionId)}`);
  }

  private async _request<T = any>(path: string, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.axios.get<T>(path, options);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status } = error.response;
        let message = `RugPlay API Responded with ${status}`;
        switch (status) {
          case 400:
            message += ' - Bad Request (invalid parameters)';
            break;
          case 401:
            message += ' - Unauthorized (invalid or missing API key)';
            break;
          case 404:
            message += " - Not Found (resource doesn't exist)";
            break;
          case 429:
            message += ' - You are being rate limited';
            break;
          case 500:
            message += ' - Internal Server Error';
            break;
          default:
            message += ` - ${error.response.statusText}`;
        }
        throw new Error(message);
      } else if (error.request) {
        throw new Error('No response received from RugPlay API');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }
}

export default RugplayClient; 