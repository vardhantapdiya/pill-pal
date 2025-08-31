import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../features/auth/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [enableBtn, setEnableBtn] = useState(false);

  const { status, error } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Validate email
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
      setEnableBtn(true);
    }

    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.trim() !== "";

    setEnableBtn(isEmailValid && isPasswordValid);
    // Check if form is valid
    setIsFormValid(
      emailRegex.test(email)
    );
  }, [email, password]);

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success("Login successful! Welcome back.");
      nav(loc.state?.from || "/");
    } catch { }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-3 sm:px-6 py-4 sm:py-8 lg:-mt-8">
      <div className="w-full max-w-sm sm:max-w-md -my-3 sm:-my-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            <span className="text-blue-600">Welcome back</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed lg:-mb-2">
            Sign in to access your saved alternatives
          </p>
        </div>

        {/* Login Form */}
        <div className=" bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <form onSubmit={submit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border transition-all duration-200 outline-none ${emailError
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 sm:focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-100'
                  }`}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2 flex items-center gap-1">
                  <span className="text-xs">⚠️</span>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold transition-all duration-200 ${enableBtn && status !== "loading"
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 cursor-pointer active:bg-blue-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              disabled={status === "loading" || !enableBtn}
            >
              {status === "loading" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            
            {/* Forgot Password Button */}
            <div className="lg:-mt-2 text-center lg:ml-35 sm:text-left ml-0">
              <button
                type="button"
                onClick={() => nav("/forgot-pass")}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 
                hover:underline cursor-pointer text-sm sm:text-base touch-manipulation"
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
              <p className="text-red-600 text-xs sm:text-sm flex items-start sm:items-center gap-2">
                <span className="text-red-500 flex-shrink-0 mt-0.5 sm:mt-0">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </p>
            </div>
          )}
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4 sm:mt-6 px-2">
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer touch-manipulation hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}