import React, { useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { clearError } from '../../features/auth/authSlice';
import { resetPassOtp } from '../../features/auth/authSlice';
import { toast } from "react-toastify";

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [enableBtn, setEnableBtn] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

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

        setEnableBtn(isEmailValid);
        // Check if form is valid
        setIsFormValid(
            emailRegex.test(email)
        );
    }, [email]);

    const submit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        try {
            await dispatch(resetPassOtp({ email })).unwrap();
            toast.success("Otp Sent! Verify to reset password.");
            // nav(loc.state?.from || "/");
            // nav(loc.state?.from || "/reset-password");
            nav("/reset-password"); 
        } catch(err) {
            console.error("OTP request failed:", err);
         }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-md -my-4 sm:-my-6">
                {/* Header */}
                <div className="text-center mb-3">
                    {/* <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-xl">👋</span>
          </div> */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 px-2 sm:px-0">
                        <span className="text-blue-600">Forgot Your Password?</span>
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base px-4 sm:px-0">
                        Don't worry, verify Your email to reset your password
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mx-2 sm:mx-0">
                    <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border transition-all duration-200 outline-none min-h-[44px] ${emailError
                                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                    : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                                    }`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {emailError && (
                                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                    <span className="text-xs">⚠️</span>
                                    {emailError}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold transition-all duration-200 min-h-[44px] touch-manipulation ${enableBtn && status !== "loading"
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md focus:ring-4 focus:ring-blue-100 cursor-pointer'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            disabled={status === "loading" || !enableBtn}
                        >
                            {status === "loading" ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending OTP...
                                </div>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                            <p className="text-red-600 text-sm flex items-center gap-2">
                                <span className="text-red-500">⚠️</span>
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-4 sm:mt-6">
                    <p className="text-gray-600 text-sm px-4 sm:px-0">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                        >
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}