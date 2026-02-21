import apiService from "./ApiService";
import type { Stock } from "../Models/Stock";

export const getPortfolio = async (): Promise<Stock[]> => {
  const response = await apiService.get<Stock[]>("portfolio");
  return response.data;
};

export const addPortfolio = async (symbol: string): Promise<void> => {
  await apiService.post("portfolio", null, {
    params: { symbol },
  });
};

export const deletePortfolio = async (symbol: string): Promise<void> => {
  await apiService.delete("portfolio", {
    params: { symbol },
  });
};
