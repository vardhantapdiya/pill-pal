import { useEffect, useRef } from "react";

export default function SaveLoginModal({ open, onClose, onSaveLocal, onGoLogin }) {
  const originalStyles = useRef({
    overflow: "",
    position: "",
    top: "",
    left: "",
    right: "",
    bottom: "",
  });

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Store original styles
      originalStyles.current = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        bottom: document.body.style.bottom,
      };

      // Get scroll position
      const scrollY = window.scrollY;
      
      // Apply scroll lock
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
      
      // Cleanup function
      return () => {
        // Restore original styles
        document.body.style.overflow = originalStyles.current.overflow;
        document.body.style.position = originalStyles.current.position;
        document.body.style.top = originalStyles.current.top;
        document.body.style.left = originalStyles.current.left;
        document.body.style.right = originalStyles.current.right;
        document.body.style.bottom = originalStyles.current.bottom;
        
        // Restore scroll position
        if (originalStyles.current.position !== 'fixed') {
          window.scrollTo(0, parseInt(scrollY || '0'));
        }
      };
    }
  }, [open]);

  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
    >
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 relative">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Sign In to <span className="text-blue-600">Save</span>
            </h3>
            <p className="text-sm text-gray-600">
              You're not logged in. Sign in to save alternatives.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Cancel Button */}
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-2 bg-white text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 outline-none focus:ring-4 focus:ring-gray-100"
            >
              Cancel
            </button>

            {/* Primary Action - Login */}
            <button 
              onClick={onGoLogin} 
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 outline-none focus:ring-4 focus:ring-blue-100 transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              <span className="mr-1">🔒</span>
              Your data is secure and private.
            </p>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}