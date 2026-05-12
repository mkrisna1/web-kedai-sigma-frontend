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

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
        const result = await loginAdmin(agentId, secretCode);

        if (result.success === true) {
            localStorage.setItem("admin_token", result.data.token);
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
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      {/* Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-10 flex flex-col gap-10">
        
        {/* Heading */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-black text-blue-600 tracking-tight">
            Kedai Sigma
          </h1>
          <p className="text-lg font-medium text-[#434655]">Admin Login</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-6">
          
          {/* Menampilkan pesan error jika login gagal */}
          {errorMessage && (
            <div className="p-3 bg-red-100 text-red-600 text-sm font-semibold rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-[#434655]">
              Username
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655] pointer-events-none"
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
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-[#F2F4F6] border border-[#C3C6D7] rounded-lg text-base text-[#434655] outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-[#434655]">
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655] pointer-events-none"
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
                placeholder="••••••••"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="w-full h-12 pl-11 pr-12 bg-[#F2F4F6] border border-[#C3C6D7] rounded-lg text-base text-[#434655] outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#434655]"
              >
                👁
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm text-[#434655]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-600">Forgot password?</a>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading} 
            className={`w-full h-12 text-white font-bold rounded-lg transition-colors ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          © 2026 Kedai Sigma
        </p>

      </div>
    </div>
  );
}