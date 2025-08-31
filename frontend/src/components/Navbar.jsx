import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toggleDarkMode } from "../features/ui/uiSlice";
import { toast } from "react-toastify";

export default function Navbar() {
  const token = useSelector(s => s.auth.token);
  const dark = useSelector(s => s.ui.darkMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Successfully logged out!");
  };

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-1 sm:space-x-2 group cursor-pointer"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
              <span className="text-white font-bold text-xs sm:text-sm">P</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              PillPal
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {token ? (
              <>
                {/* Authenticated Navigation */}
                <Link
                  to="/"
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive('/') 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Search
                </Link>
                
                <Link
                  to="/saved"
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive('/saved') 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Saved
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 
                    rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Guest Navigation */}
                <Link
                  to="/"
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive('/') 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Search
                </Link>

                <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200">
                  <Link
                    to="/login"
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive('/login') 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Login
                  </Link>
                  
                  <Link
                    to="/signup"
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                      isActive('/signup') ? 'bg-blue-700 shadow-md' : ''
                    }`}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}