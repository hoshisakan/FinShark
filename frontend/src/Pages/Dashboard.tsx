import { useEffect, useState, type FormEvent } from "react";
import StockList from "../Components/StockList";
import { createStock, getStocks } from "../Services/StockService";
import { useAuth } from "../Context/AuthContext";
import type { Comment, Stock } from "../Models/Stock";
import { addPortfolio, deletePortfolio, getPortfolio } from "../Services/PortfolioService";
import { createComment, deleteComment, getAllComments } from "../Services/CommentService";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createStockError, setCreateStockError] = useState<string | null>(null);
  const [createStockSuccess, setCreateStockSuccess] = useState<string | null>(null);
  const [stockForm, setStockForm] = useState({
    symbol: "",
    companyName: "",
    purchase: "",
    lastDiv: "",
    industry: "",
    marketCap: "",
  });
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [portfolioSymbol, setPortfolioSymbol] = useState("");
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentTitle, setCommentTitle] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  const loadStocks = async (searchSymbol?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStocks({ symbol: searchSymbol?.trim() || undefined });
      setStocks(data);
    } catch {
      setError("Unable to fetch stocks. Ensure backend is running and token is valid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStocks();
    void loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setPortfolioError(null);
    try {
      const data = await getPortfolio();
      setPortfolio(data);
    } catch {
      setPortfolioError("Unable to fetch portfolio.");
    }
  };

  const loadCommentsForStock = async (stockId: number) => {
    setCommentError(null);
    try {
      const allComments = await getAllComments();
      setComments(allComments.filter((comment) => comment.stockId === stockId));
    } catch {
      setCommentError("Unable to fetch comments.");
    }
  };

  const onSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadStocks(symbol);
  };

  const onCreateStock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateStockError(null);
    setCreateStockSuccess(null);

    try {
      await createStock({
        symbol: stockForm.symbol.trim(),
        companyName: stockForm.companyName.trim(),
        purchase: Number(stockForm.purchase),
        lastDiv: Number(stockForm.lastDiv),
        industry: stockForm.industry.trim(),
        marketCap: Number(stockForm.marketCap),
      });

      setCreateStockSuccess("Stock created successfully.");
      setStockForm({
        symbol: "",
        companyName: "",
        purchase: "",
        lastDiv: "",
        industry: "",
        marketCap: "",
      });

      await loadStocks(symbol);
    } catch {
      setCreateStockError("Unable to create stock. Please check input constraints.");
    }
  };

  const onSelectStock = async (stockId: number) => {
    setSelectedStockId(stockId);
    await loadCommentsForStock(stockId);
  };

  const onAddPortfolio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!portfolioSymbol.trim()) return;
    setPortfolioError(null);
    try {
      await addPortfolio(portfolioSymbol.trim());
      setPortfolioSymbol("");
      await loadPortfolio();
    } catch {
      setPortfolioError("Unable to add stock to portfolio.");
    }
  };

  const onDeletePortfolio = async (symbolToDelete: string) => {
    setPortfolioError(null);
    try {
      await deletePortfolio(symbolToDelete);
      await loadPortfolio();
    } catch {
      setPortfolioError("Unable to delete stock from portfolio.");
    }
  };

  const onCreateComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStockId) return;
    setCommentError(null);

    try {
      await createComment({
        stockId: selectedStockId,
        title: commentTitle,
        content: commentContent,
      });
      setCommentTitle("");
      setCommentContent("");
      await loadCommentsForStock(selectedStockId);
    } catch {
      setCommentError("Unable to create comment. Ensure title/content are valid (min 5 chars).");
    }
  };

  const onDeleteComment = async (commentId: number) => {
    if (!selectedStockId) return;
    setCommentError(null);
    try {
      await deleteComment(commentId);
      await loadCommentsForStock(selectedStockId);
    } catch {
      setCommentError("Unable to delete comment.");
    }
  };

  return (
    <div className="page">
      <div className="card card-wide">
        <div className="header-row">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.username ?? "User"}</p>
          </div>
          <button onClick={logout}>Logout</button>
        </div>

        <form className="search-form" onSubmit={onSearch}>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Search by symbol (e.g. AAPL)"
          />
          <button type="submit">Search</button>
          <button type="button" onClick={() => void loadStocks()}>
            Reset
          </button>
        </form>

        <section className="panel create-stock-panel">
          <h2>Create Stock</h2>
          <form className="create-stock-grid" onSubmit={onCreateStock}>
            <input
              value={stockForm.symbol}
              onChange={(e) => setStockForm((prev) => ({ ...prev, symbol: e.target.value }))}
              placeholder="Symbol"
              maxLength={10}
              required
            />
            <input
              value={stockForm.companyName}
              onChange={(e) => setStockForm((prev) => ({ ...prev, companyName: e.target.value }))}
              placeholder="Company Name"
              maxLength={50}
              required
            />
            <input
              type="number"
              value={stockForm.purchase}
              onChange={(e) => setStockForm((prev) => ({ ...prev, purchase: e.target.value }))}
              placeholder="Purchase"
              min={1}
              step="0.01"
              required
            />
            <input
              type="number"
              value={stockForm.lastDiv}
              onChange={(e) => setStockForm((prev) => ({ ...prev, lastDiv: e.target.value }))}
              placeholder="Last Div"
              min={0.001}
              step="0.001"
              required
            />
            <input
              value={stockForm.industry}
              onChange={(e) => setStockForm((prev) => ({ ...prev, industry: e.target.value }))}
              placeholder="Industry"
              maxLength={10}
              required
            />
            <input
              type="number"
              value={stockForm.marketCap}
              onChange={(e) => setStockForm((prev) => ({ ...prev, marketCap: e.target.value }))}
              placeholder="Market Cap"
              min={1}
              step="1"
              required
            />
            <button className="create-stock-submit" type="submit">
              Create Stock
            </button>
          </form>
          {createStockError && <p className="error">{createStockError}</p>}
          {createStockSuccess && <p className="success">{createStockSuccess}</p>}
        </section>

        {error && <p className="error">{error}</p>}
        <StockList
          stocks={stocks}
          loading={loading}
          selectedStockId={selectedStockId}
          onSelectStock={onSelectStock}
        />

        <div className="dashboard-grid">
          <section className="panel">
            <h2>Portfolio</h2>
            <form className="inline-form" onSubmit={onAddPortfolio}>
              <input
                value={portfolioSymbol}
                onChange={(e) => setPortfolioSymbol(e.target.value)}
                placeholder="Symbol (e.g. MSFT)"
              />
              <button type="submit">Add</button>
            </form>
            {portfolioError && <p className="error">{portfolioError}</p>}
            <ul className="list">
              {portfolio.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.symbol} - {item.companyName}
                  </span>
                  <button type="button" onClick={() => void onDeletePortfolio(item.symbol)}>
                    Remove
                  </button>
                </li>
              ))}
              {portfolio.length === 0 && <li>No portfolio items.</li>}
            </ul>
          </section>

          <section className="panel">
            <h2>Comments</h2>
            {!selectedStockId && <p>Select a stock from the table to view/add comments.</p>}

            {selectedStockId && (
              <>
                <p>Selected Stock ID: {selectedStockId}</p>
                <form className="form" onSubmit={onCreateComment}>
                  <label>
                    Title
                    <input
                      value={commentTitle}
                      onChange={(e) => setCommentTitle(e.target.value)}
                      minLength={5}
                      maxLength={280}
                      required
                    />
                  </label>
                  <label>
                    Content
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      minLength={5}
                      maxLength={280}
                      required
                    />
                  </label>
                  <button type="submit">Post Comment</button>
                </form>
              </>
            )}

            {commentError && <p className="error">{commentError}</p>}
            <ul className="list">
              {comments.map((comment) => (
                <li key={comment.id}>
                  <div>
                    <strong>{comment.title}</strong>
                    <p>{comment.content}</p>
                    <small>
                      {comment.createdBy} - {new Date(comment.createdOn).toLocaleString()}
                    </small>
                  </div>
                  <button type="button" onClick={() => void onDeleteComment(comment.id)}>
                    Delete
                  </button>
                </li>
              ))}
              {selectedStockId && comments.length === 0 && <li>No comments for this stock.</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
