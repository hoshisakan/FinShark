import apiService from "./ApiService";
import type { Stock } from "../Models/Stock";

interface GetStocksQuery {
  symbol?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateStockPayload {
  symbol: string;
  companyName: string;
  purchase: number;
  lastDiv: number;
  industry: string;
  marketCap: number;
}

export const getStocks = async (query: GetStocksQuery = {}): Promise<Stock[]> => {
  const response = await apiService.get<Stock[]>("stock", {
    params: {
      ...(query.symbol ? { symbol: query.symbol } : {}),
      pageNumber: query.pageNumber ?? 1,
      pageSize: query.pageSize ?? 20,
    },
  });

  return response.data;
};

export const createStock = async (payload: CreateStockPayload): Promise<Stock> => {
  const response = await apiService.post<Stock>("stock", payload);
  return response.data;
};
