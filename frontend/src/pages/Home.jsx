import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // NEW: disclaimer state (always true on load)
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!showDisclaimer) return;

    setCanClose(false);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showDisclaimer]);


  useEffect(() => {
    const hasShown = sessionStorage.getItem("disclaimerShown");
    if (!hasShown) {
      setShowDisclaimer(true);
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="relative min-h-screen">
      {/* ================= BACKGROUND (BLURRED WHEN MODAL OPEN) ================= */}
      <section
        className={`max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 
        -my-6 sm:-my-8 md:-my-12 transition-all duration-300
        ${showDisclaimer ? "blur-sm pointer-events-none" : ""}`}
      >
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Find <span className="text-blue-600">Affordable</span> & Safe
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Medicine Alternatives
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Discover cost-effective alternatives to your prescribed medications without compromising on quality or safety.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto px-2 sm:px-0">
          <form onSubmit={submit} className="relative">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:ring-4 focus-within:ring-blue-100">
              <input
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg placeholder-gray-400 bg-transparent border-none outline-none min-h-[48px]"
                placeholder="Enter medicine name..."
                value={q}
                onChange={e => setQ(e.target.value)}
              />
              <button
                type="submit"
                className={`px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors 
                duration-200 outline-none focus:bg-blue-700 text-base sm:text-lg min-h-[48px] ${q.length < 4 ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Suggestions */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2 sm:mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2 justify-center px-2">
              {["Ibugesic Plus", "Crocin", "Dolo 650", "Becosules"].map((med) => (
                <button
                  key={med}
                  onClick={() => setQ(med)}
                  className="px-3 sm:px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-full hover:bg-blue-50 
                  hover:text-blue-600 transition-colors duration-200 border border-transparent 
                  hover:border-blue-200 cursor-pointer min-h-[36px] touch-manipulation"
                >
                  {med}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-2 sm:px-0">
          <div className="text-center p-4 sm:p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl">💊</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Safe Alternatives</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              All suggested alternatives are medically equivalent and safe to use.
            </p>
          </div>

          <div className="text-center p-4 sm:p-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Cost Effective</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Save up to 70% on your medical expenses with budget-friendly options.
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Easy to Find</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Quickly discover alternatives available at your local pharmacy.
            </p>
          </div>
        </div>
      </section>

      {/* ================= DISCLAIMER MODAL ================= */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 sm:px-6">
          <div
            className="
        w-full 
        max-w-sm sm:max-w-md md:max-w-lg
        rounded-2xl 
        bg-white 
        p-5 sm:p-6 md:p-8
        shadow-xl
        animate-in fade-in zoom-in-95
      "
          >
            <h2 className="flex flex-row justify-center mb-3 text-lg sm:text-xl font-semibold text-red-600">
              ⚠️ Medical Disclaimer
            </h2>

            <p className="mb-2 text-sm sm:text-base text-gray-700 leading-relaxed">
              Pill-Pal provides AI-generated medicine alternatives for
              <span className="font-medium"> informational purposes only</span>.
            </p>

            <p className="mb-5 text-sm sm:text-base text-gray-700 leading-relaxed">
              This is <strong>not professional medical advice</strong>.
              Always consult a qualified doctor or pharmacist before taking
              any medicine. Pill-Pal is not responsible for any harm,
              side effects, or misuse.
            </p>

            <button
              disabled={!canClose}
              onClick={() => {
                sessionStorage.setItem("disclaimerShown", "true");
                setShowDisclaimer(false);
              }}
              className={`w-full rounded-xl py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition
                  ${canClose ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
              {canClose ? "Close" : `Please read the disclaimer (${countdown})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}