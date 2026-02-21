import type { Stock } from "../Models/Stock";

type StockListProps = {
  stocks: Stock[];
  loading?: boolean;
  selectedStockId?: number | null;
  onSelectStock?: (stockId: number) => void;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

export default function StockList({
  stocks,
  loading = false,
  selectedStockId = null,
  onSelectStock,
}: StockListProps) {
  if (loading) {
    return <p>Loading stocks...</p>;
  }

  if (stocks.length === 0) {
    return <p>No stocks found.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>Industry</th>
            <th>Purchase</th>
            <th>Last Div</th>
            <th>Market Cap</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id} className={selectedStockId === stock.id ? "selected-row" : ""}>
              <td>{stock.symbol}</td>
              <td>{stock.companyName}</td>
              <td>{stock.industry}</td>
              <td>{formatMoney(stock.purchase)}</td>
              <td>{formatMoney(stock.lastDiv)}</td>
              <td>{formatNumber(stock.marketCap)}</td>
              <td>{stock.comments?.length ?? 0}</td>
              <td>
                <button type="button" onClick={() => onSelectStock?.(stock.id)}>
                  Comments
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
