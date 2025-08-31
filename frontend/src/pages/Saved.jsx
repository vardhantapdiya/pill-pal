import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSaved, deleteSaved } from "../features/saved/savedSlice";
import { toast } from "react-toastify";

export default function Saved() {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.saved);
  
  function deleteItem(id){
    dispatch(deleteSaved(id));
    toast.success("Alternative deleted successfully");
  }

  useEffect(()=>{ dispatch(fetchSaved()); }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-sm font-semibold">💾</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Saved Alternatives
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base px-2 sm:px-0">
          Your collection of affordable medicine alternatives
        </p>
      </div>

      {/* Loading State */}
      {status === "loading" && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-6 px-2 sm:px-0">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-500 font-medium">Loading your saved alternatives...</p>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse mx-2 sm:mx-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded-lg w-36 sm:w-48 mb-2 sm:mb-3"></div>
                    <div className="h-3 sm:h-4 bg-gray-100 rounded-lg w-24 sm:w-32 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-100 rounded-lg w-16 sm:w-24"></div>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!items.length && status !== "loading" && (
        <div className="text-center py-12 sm:py-16 px-4 sm:px-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-gray-400 text-xl sm:text-2xl">💾</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No saved alternatives yet</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Start searching for medicines to save affordable alternatives for future reference.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-5 sm:px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 cursor-pointer text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            Start Searching
          </a>
        </div>
      )}

      {/* Saved Items */}
      {items.length > 0 && status !== "loading" && (
        <div className="space-y-3 sm:space-y-4">
          {/* Items Counter */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                {items.length} saved alternative{items.length !== 1 ? 's' : ''}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid gap-3 sm:gap-4">
            {items.map((it) => (
              <div 
                key={it._id} 
                className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group mx-2 sm:mx-0"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Alternative Name */}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200 truncate">
                      {it?.name}
                    </h3>
                    
                    {/* Original Medicine */}
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                      <span className="truncate">Alternative to <span className="font-medium text-gray-700">{it.medicine?.name}</span></span>
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        {it?.price || "Price unavailable"}
                      </span>
                    </div>
                    
                    {/* Link */}
                    <div>
                      {it?.link ? (
                        <a 
                          href={it.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200 cursor-pointer"
                        >
                          <span>🛒</span>
                          <span>Buy Now</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                          No purchase link available
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteItem(it._id)}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-400 hover:text-red-600 
                    hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:opacity-100 opacity-70
                    cursor-pointer flex-shrink-0 min-h-[32px] sm:min-h-[40px] touch-manipulation"
                    title="Remove from saved"
                  >
                    <span className="text-base sm:text-lg">🗑️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}