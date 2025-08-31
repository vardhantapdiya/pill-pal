// import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Disclaimer from "./components/Disclaimer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Saved from "./pages/Saved";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPass from "./pages/Auth/ForgotPass";
import ResetPassword from "./pages/Auth/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
        {/* Navbar with backdrop blur for modern effect */}
        <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
          <Navbar />
        </div>
        
        {/* Main content area with refined spacing */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="py-6 sm:py-8 md:py-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/saved" element={
                  <ProtectedRoute><Saved/></ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/forgot-pass" element={<ForgotPass />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </main>
        
        {/* Footer with subtle separator */}
        <div className="border-t border-gray-100 bg-white/50">
          <Disclaimer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App