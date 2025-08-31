import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword, resendOtp } from '../../features/auth/authSlice';

function ResetPassword() {
    const [localError, setLocalError] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isResendingOtp, setIsResendingOtp] = useState(false);

    const email = useSelector(s => s.auth.pendingSignupEmail);
    const { status, error } = useSelector(s => s.auth);
    const dispatch = useDispatch();
    const nav = useNavigate();

    // Password validation function
    const validatePassword = (pwd) => {
        const requirements = {
            length: pwd.length >= 6,
            uppercase: /[A-Z]/.test(pwd),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
            number: /\d/.test(pwd)
        };
        
        return Object.values(requirements).every(req => req);
    };

    // Check if form is valid
    const isFormValid = () => {
        return code.length === 6 && 
               password && 
               confirmPassword && 
               password === confirmPassword && 
               validatePassword(password);
    };

    async function OtpResend() {
        if (!email) {
            setLocalError("No email found. Please start the signup process again.");
            return;
        }
        
        setIsResendingOtp(true);
        try {
            await dispatch(resendOtp({ email })).unwrap();
            toast.success("Otp Resent successfully! Check your inbox");
        } catch {
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setIsResendingOtp(false);
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        setLocalError("");
        if (!email) {
            setLocalError("No email found. Please start the signup process again.");
            return
        };
        try {
            await dispatch(resetPassword({ email, password, code })).unwrap();
            toast.success("Otp Verification Successful, You can Login now!")
            nav("/login");
        } catch { }
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 -mt-8 pb-2 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-2">
                {/* Header */}
                <div className="text-center mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        Verify Your <span className="text-blue-600">Email</span>
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm mb-0.5">
                        We've sent a verification code to
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-blue-600 break-all">
                        {email || "your email"}
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4">
                    <form onSubmit={submit} className="space-y-2.5 sm:space-y-3">
                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter the Otp
                            </label>
                            <input
                                className="w-full px-3 py-2 text-base sm:text-lg text-center tracking-widest font-mono placeholder-gray-400 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="000000"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                maxLength="6"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 text-base placeholder-gray-400 bg-white border rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${passwordError ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder="Create a strong password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 text-base placeholder-gray-400 bg-white border rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                                    confirmPassword && password !== confirmPassword 
                                        ? 'border-red-500 focus:ring-red-100 focus:border-red-500' 
                                        : 'border-gray-200'
                                }`}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <span className="mr-1">⚠</span>
                                    Passwords do not match
                                </p>
                            )}
                            {confirmPassword && password === confirmPassword && password && (
                                <p className="text-green-600 text-xs mt-1 flex items-center">
                                    <span className="mr-1">✓</span>
                                    Passwords match
                                </p>
                            )}
                        </div>

                        {/* Password Requirements - Compact */}
                        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center text-xs">
                                <span className="mr-1.5">🔐</span>
                                Password Requirements
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                <div className={`flex items-center text-xs ${password.length >= 6 ? "text-green-600" : "text-gray-500"}`}>
                                    <span className="mr-1.5 w-3 flex-shrink-0">{password.length >= 6 ? "✓" : "○"}</span>
                                    6+ characters
                                </div>
                                <div className={`flex items-center text-xs ${/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                                    <span className="mr-1.5 w-3 flex-shrink-0">{/[A-Z]/.test(password) ? "✓" : "○"}</span>
                                    Capital letter
                                </div>
                                <div className={`flex items-center text-xs ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                                    <span className="mr-1.5 w-3 flex-shrink-0">{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "✓" : "○"}</span>
                                    Special symbol
                                </div>
                                <div className={`flex items-center text-xs ${/\d/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                                    <span className="mr-1.5 w-3 flex-shrink-0">{/\d/.test(password) ? "✓" : "○"}</span>
                                    Number
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 outline-none focus:ring-4 ${
                                !isFormValid() || status === "loading"
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-blue-100 transform hover:-translate-y-0.5 active:transform active:scale-95"
                            }`}
                            disabled={!isFormValid() || status === "loading"}
                        >
                            {status === "loading" ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : "Verify and Reset"}
                        </button>
                    </form>

                    {/* Error Messages */}
                    {localError && (
                        <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-xs flex items-start">
                                <span className="mr-2 flex-shrink-0">❌</span>
                                <span className="break-words">{localError}</span>
                            </p>
                        </div>
                    )}

                    {error && !localError && (
                        <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-xs flex items-start">
                                <span className="mr-2 flex-shrink-0">❌</span>
                                <span className="break-words">{error}</span>
                            </p>
                        </div>
                    )}

                    {/* Help Section - Resend Code with separate loading state */}
                    <div className="mt-3 p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-center">
                            <p className="text-xs text-blue-700 mb-2">
                                Didn't receive the code?
                            </p>
                            <button
                                onClick={OtpResend}
                                disabled={isResendingOtp}
                                className={`px-3 py-1.5 text-xs cursor-pointer font-semibold rounded-lg transition-all duration-200 min-w-[100px] ${
                                    isResendingOtp 
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "text-blue-600 hover:text-blue-700 hover:bg-blue-100 hover:underline active:scale-95"
                                }`}
                            >
                                {isResendingOtp ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : "Resend Code"}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-3">
                        <p className="text-gray-600 text-xs">
                            Need help?{" "}
                            <button
                                onClick={() => nav("/signup")}
                                className=" cursor-pointer text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 hover:underline active:scale-95"
                            >
                                Start Over
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword