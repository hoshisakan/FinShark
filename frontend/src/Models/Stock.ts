export interface Comment {
  id: number;
  title: string;
  content: string;
  createdOn: string;
  createdBy: string;
  stockId?: number | null;
}

export interface Stock {
  id: number;
  symbol: string;
  companyName: string;
  purchase: number;
  lastDiv: number;
  industry: string;
  marketCap: number;
  comments?: Comment[];
}
