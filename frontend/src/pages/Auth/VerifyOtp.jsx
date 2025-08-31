import { useDispatch, useSelector } from "react-redux";
import { resendOtp, verifyOtp } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const [code, setCode] = useState("");
  const email = useSelector(s => s.auth.pendingSignupEmail);
  const { status, error } = useSelector(s => s.auth);
  const [localError, setLocalError] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  async function otpResend(){
     if (!email) {
        setLocalError("No email found. Please start the signup process again.");
        return};
    try{
      await dispatch(resendOtp({email})).unwrap();
      toast.success("Otp resent successfully! Check you Inbox")
    }
    catch{}
  }

  const submit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email) {
        setLocalError("No email found. Please start the signup process again.");
        return};
    try {
      await dispatch(verifyOtp({ email, code })).unwrap();
      toast.success("Otp Verification Successfull, Welcome!")
      nav("/");
    } catch {}
  };

  return (
    <div className="max-w-md mx-auto px-6 py-4">
      {/* Header */}
      <div className="text-center mb-4 -my-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verify Your <span className="text-blue-600">Email</span>
        </h1>
        <p className="text-gray-600 mb-1">
          We've sent a verification code to
        </p>
        <p className="text-lg font-semibold text-blue-600">
          {email || "your email"}
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <form onSubmit={submit} className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input 
              className="w-full px-4 py-3 text-base text-center tracking-widest font-mono placeholder-gray-400 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              placeholder="000000"
              value={code} 
              onChange={e => setCode(e.target.value)}
              maxLength="6"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>
          
          {/* Submit Button */}
          <button 
            className={`w-full px-6 py-3 text-base font-semibold cursor-pointer rounded-xl transition-all duration-300 outline-none focus:ring-4 ${
              code.length !== 6 || status === "loading"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-blue-100 transform hover:-translate-y-0.5"
            }`} 
            disabled={code.length !== 6 || status === "loading"}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : "Verify Code"}
          </button>
        </form>
        
        {/* Error Messages */}
        {localError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm flex items-center">
              <span className="mr-2">❌</span>
              {localError}
            </p>
          </div>
        )}
        
        {error && !localError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-2">
              Didn't receive the code?
            </p>
            <button 
              onClick={otpResend}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 
              hover:underline text-sm cursor-pointer">
              Resend Code
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Need help?{" "}
            <button 
              onClick={() => nav("/signup")}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 hover:underline"
            >
              Start Over
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}