import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocal, saveToServer, makeSelectIsSaved } from "../features/saved/savedSlice";
import SaveLoginModal from "./SaveLoginModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SearchResultCard({ medicineName, alt }) {
  const token = useSelector(s => s.auth.token);
  const selectIsSaved = makeSelectIsSaved(medicineName, alt.name);
  const isSaved = useSelector(selectIsSaved);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (isSaved) return;
    if (!token) { 
      toast.error("Sign in to save the alternatives");
      return; 
    }
    try {
      await dispatch(saveToServer({ medicineName, alternative: alt })).unwrap();
      toast.success("Alternative saved successfully!");
    } catch(error) {
      toast.error("Failed to save alternative. Please try again.");
    }
  };

  const saveLocal = () => {
    dispatch(addLocal({ medicineName, alternative: alt }));
    toast.success("Alternative saved locally!");
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mx-2 sm:mx-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
        {/* Medicine Info */}
        <div className="flex-1 sm:mr-4">
          {/* Medicine Name */}
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <span className="text-blue-600 font-semibold text-base sm:text-lg">💊</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">{alt.name}</h4>
          </div>
          
          {/* Price */}
          <div className="mb-3">
            {alt.price ? (
              <div className="flex items-center">
                <span className="text-green-600 font-semibold text-lg sm:text-xl mr-2">₹{alt.price}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Budget Friendly
                </span>
              </div>
            ) : (
              <span className="text-gray-400 text-sm flex items-center">
                <span className="mr-1">💰</span>
                Price unavailable
              </span>
            )}
          </div>

          {/* Buy Link */}
          <div className="mb-3 sm:mb-4">
            {alt.link ? (
              <a 
                href={alt.link} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors duration-200 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer min-h-[40px] touch-manipulation"
              >
                <span className="mr-1 sm:mr-2">🛒</span>
                Buy Now
              </a>
            ) : (
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-500 text-sm rounded-lg sm:rounded-xl min-h-[40px]">
                <span className="mr-1 sm:mr-2">🚫</span>
                No purchase link available
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col items-start sm:items-end">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold text-sm transition-all duration-300 outline-none focus:ring-4 min-h-[40px] touch-manipulation ${
              isSaved 
                ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed" 
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-blue-100"
            }`}
            title={isSaved ? "Already saved" : "Save this alternative"}
          >
            <span className="flex items-center cursor-pointer">
              {isSaved ? (
                <>
                  <span className="mr-1">✅</span>
                  Saved
                </>
              ) : (
                <>
                  <span className="mr-1">💾</span>
                  Save
                </>
              )}
            </span>
          </button>
          
          {isSaved && (
            <span className="text-xs text-green-600 mt-1 font-medium">
              Added to your list
            </span>
          )}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="mr-1 flex-shrink-0">🔍</span>
            <span className="truncate">Alternative for <span className="font-semibold text-gray-700 ml-1">{medicineName}</span></span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">✓</span>
            Safe & Effective
          </div>
        </div>
      </div>

      <SaveLoginModal
        open={open}
        onClose={() => setOpen(false)}
        onSaveLocal={saveLocal}
        onGoLogin={() => navigate("/login")}
      />
    </div>
  );
}