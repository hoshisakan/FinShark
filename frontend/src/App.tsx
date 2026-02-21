import "./App.css";
import { useAuth } from "./Context/AuthContext";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";

function App() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

export default App;
