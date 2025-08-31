import { useDispatch, useSelector } from "react-redux";
import { signup, setPendingSignupEmail, clearError } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { status, error } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation regex: at least 6 characters, 1 capital, 1 symbol, 1 number
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

   useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Validate email
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    // Validate password
    if (password && !passwordRegex.test(password)) {
      setPasswordError("Password must be at least 6 characters with 1 capital letter, 1 symbol, and 1 number");
    } else {
      setPasswordError("");
    }

    // Check if form is valid
    setIsFormValid(
      emailRegex.test(email) && 
      passwordRegex.test(password)
    );
  }, [email, password]);

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    try {
      await dispatch(signup({ email, password })).unwrap();
      toast.success("Otp sent successfully")
      dispatch(setPendingSignupEmail(email));
      nav("/verify-otp");
    } catch {}
  };  

  return (
    <div className="max-w-md mx-auto px-6 py-2">
      {/* Header */}
      <div className="text-center mb-4 -my-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your <span className="text-blue-600">Account</span>
        </h1>
        <p className="text-gray-600">
          Join us to discover affordable medicine alternatives
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <form onSubmit={submit} className="space-y-3">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              className={`w-full px-4 py-2 text-base placeholder-gray-400 bg-white border rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                emailError ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              }`} 
              placeholder="Enter your email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              type="email"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠</span>
                {emailError}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              type="password" 
              className={`w-full px-4 py-2 text-base placeholder-gray-400 bg-white border rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                passwordError ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              }`} 
              placeholder="Create a strong password"
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠</span>
                {passwordError}
              </p>
            )}
            {password && !passwordError && (
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <span className="mr-1">✓</span>
                Password meets all requirements
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <button 
            className={`w-full px-6 py-2 text-base cursor-pointer font-semibold rounded-xl transition-all duration-300 outline-none focus:ring-4 ${
              !isFormValid || status === "loading" 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-blue-100 transform hover:-translate-y-0.5"
            }`} 
            disabled={!isFormValid || status === "loading"}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </span>
            ) : "Send OTP"}
          </button>
        </form>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          </div>
        )}

        {/* Password Requirements - Inside the form card */}
        <div className="mt-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
            <span className="mr-2">🔐</span>
            Password Requirements
          </h3>
          <div className="space-y-1">
            <div className={`flex items-center text-sm ${password.length >= 6 ? "text-green-600" : "text-gray-500"}`}>
              <span className="mr-2 w-4">{password.length >= 6 ? "✓" : "○"}</span>
              At least 6 characters
            </div>
            <div className={`flex items-center text-sm ${/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
              <span className="mr-2 w-4">{/[A-Z]/.test(password) ? "✓" : "○"}</span>
              One capital letter
            </div>
            <div className={`flex items-center text-sm ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
              <span className="mr-2 w-4">{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "✓" : "○"}</span>
              One special symbol
            </div>
            <div className={`flex items-center text-sm ${/\d/.test(password) ? "text-green-600" : "text-gray-500"}`}>
              <span className="mr-2 w-4">{/\d/.test(password) ? "✓" : "○"}</span>
              One number
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button 
              onClick={() => nav("/login")}
              className="cursor-pointer text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}