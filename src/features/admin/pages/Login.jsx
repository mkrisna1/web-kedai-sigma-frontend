import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      setErrorMessage("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginAdmin(cleanUsername, password);

      if (result.success === true) {
        window.localStorage.setItem("admin_data", JSON.stringify(result.data.admin));
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.message || "Username atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-10 rounded-2xl border border-gray-200 bg-white p-10 shadow-xl"
      >
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-black tracking-tight text-blue-600">
            Kedai Sigma
          </h1>
          <p className="text-lg font-medium text-[#434655]">Admin Login</p>
        </div>

        <div className="flex flex-col gap-6">
          {errorMessage && (
            <div className="rounded-lg bg-red-100 p-3 text-center text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#434655]">
              Username
            </span>
            <span className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655]"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#C3C6D7] bg-[#F2F4F6] pl-11 pr-4 text-base text-[#434655] outline-none focus:border-blue-500"
                autoComplete="username"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#434655]">
              Password
            </span>
            <span className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655]"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#C3C6D7] bg-[#F2F4F6] pl-11 pr-16 text-base text-[#434655] outline-none focus:border-blue-500"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase text-[#434655] transition hover:text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className={`h-12 w-full rounded-lg font-bold text-white transition-colors ${
              isLoading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">(C) 2026 Kedai Sigma</p>
      </form>
    </div>
  );
}
