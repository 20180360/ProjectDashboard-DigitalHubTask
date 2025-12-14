"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "../../components/services/authService";
import { setCredentials } from "../../components/store/slices/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Component states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form submission handler
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Call login service
    const data = await login({ email, password });
    
    // Store user data in application state
    dispatch(setCredentials({ 
      user: data.user, 
      token: data.token 
    }));
    
    // Redirect to dashboard
    router.push("/dashboard");
  } catch (err: unknown) {
    // Check if error is an AxiosError (or has response.data.message)
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "Login failed. Please check your credentials.");
    } else {
      setError("Login failed. Please check your credentials.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-md md:max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login to Your Account
        </h2>

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-6 rounded shadow-md">
            {error}
          </div>
        )}

        {/* Email field */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-base font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="Enter your email"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-base font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}