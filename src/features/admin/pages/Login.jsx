import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await loginAdmin(agentId, secretCode);

      if (result.success === true) {
        localStorage.setItem("admin_data", JSON.stringify(result.data.admin));
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex w-full max-w-md flex-col gap-10 rounded-2xl border border-gray-200 bg-white p-10 shadow-xl">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-black tracking-tight text-blue-600">
            Kedai Sigma
          </h1>
          <p className="text-lg font-medium text-[#434655]">Admin Login</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="rounded-lg bg-red-100 p-3 text-center text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#434655]">
              Username
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655]"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder="Enter your username"
                value={agentId}
                onChange={(event) => setAgentId(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#C3C6D7] bg-[#F2F4F6] pl-11 pr-4 text-base text-[#434655] outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#434655]">
              Password
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655]"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={secretCode}
                onChange={(event) => setSecretCode(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#C3C6D7] bg-[#F2F4F6] pl-11 pr-14 text-base text-[#434655] outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase text-[#434655]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#434655]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`h-12 w-full rounded-lg font-bold text-white transition-colors ${
              isLoading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Copyright 2026 Kedai Sigma
        </p>
      </div>
    </div>
  );
}
