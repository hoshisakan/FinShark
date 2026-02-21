import { useState, type FormEvent } from "react";
import { useAuth } from "../Context/AuthContext";

export default function LoginPage() {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const passwordRule =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login({ username, password });
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!passwordRule.test(password)) {
        setError(
          "Password must be at least 12 chars and include uppercase, lowercase, number and special character."
        );
        return;
      }

      await register({ username, email, password });
    } catch {
      setError(
        mode === "login"
          ? "Login failed. Please check your username and password."
          : "Register failed. Please verify your inputs or try a different username/email."
      );
    }
  };

  const switchMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>{mode === "login" ? "FinShark Login" : "Create Account"}</h1>
        <p>
          {mode === "login"
            ? "Sign in to access stock dashboard."
            : "Register a new account to start using FinShark."}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </label>

          {mode === "register" && (
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                autoComplete="email"
                required
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </label>

          {mode === "register" && (
            <>
              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  required
                />
              </label>
              <p className="hint">
                Password rule: at least 12 chars, include upper/lowercase, number and special
                symbol.
              </p>
            </>
          )}

          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
              ? "Sign in"
              : "Register"}
          </button>
        </form>

        <div className="switch-auth-mode">
          {mode === "login" ? (
            <p>
              No account?{" "}
              <button type="button" className="text-button" onClick={() => switchMode("register")}>
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button type="button" className="text-button" onClick={() => switchMode("login")}>
                Back to login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
