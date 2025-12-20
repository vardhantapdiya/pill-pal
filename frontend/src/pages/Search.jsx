import { useEffect, useState,useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import SkeletonCard from "../components/SkeletonCard";
import SearchResultCard from "../components/SearchResultCard";

export default function Search() {
  const [params] = useSearchParams();
  const name = params.get("q") || "";
  const [data, setData] = useState(null); // { alternatives: [...] }
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const seqRef = useRef(0);

  // useEffect(() => {
  //   const run = async () => {
  //     if (!name) return;
  //     setLoading(true); setErr("");
  //     try {
  //       const { data } = await api.post("/search",{ medicineName: name });
  //       setData(data);
  //     } catch (e) {
  //       setErr("Failed to fetch results");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   run();
  // }, [name]);

  useEffect(() => {
    toast.info("Server is on Render's basic tier, so you may experience slight delays. Your patience is appreciated!",
      { autoClose: 6000 }
    )
  }, [])

  useEffect(() => {
    const run = async () => {
      if (!name) return;
      const mySeq = ++seqRef.current;

      setLoading(true);
      setErr("");
      try {
        const res = await api.post("/search", { medicineName: name });
        // ignore if a newer request has started
        if (mySeq !== seqRef.current) return;
        setData(res.data);
      } catch (e) {
        if (mySeq !== seqRef.current) return; // stale error, ignore
        setErr("Failed to fetch results");
      } finally {
        if (mySeq === seqRef.current) setLoading(false);
      }
    };
    run();
  }, [name]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Search Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-sm font-semibold">🔍</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Search Results
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 px-2 sm:px-0">
          Alternatives for <span className="font-semibold text-gray-900 px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-sm sm:text-base">"{name}"</span>
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-6 px-2 sm:px-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-500 font-medium">Finding the best alternatives...</p>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_,i)=> <SkeletonCard key={i}/>)}
          </div>
        </div>
      )}

      {/* Error State */}
      {err && (
        <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center mx-2 sm:mx-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-red-600 text-lg sm:text-xl">⚠️</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{err}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 cursor-pointer text-sm sm:text-base min-h-[40px] touch-manipulation"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {data?.data?.alternatives?.length ? (
        <div className="space-y-3 sm:space-y-4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-2 px-2 sm:px-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Found {data.data.alternatives.length} alternative{data.data.alternatives.length !== 1 ? 's' : ''}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            {/* <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full self-start sm:self-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Sorted by affordability
            </div> */}
          </div>
          
          {/* Results Grid */}
          <div className="grid gap-3 sm:gap-4">
            {data.data.alternatives.map((alt, i)=> (
              <SearchResultCard key={i} medicineName={name} alt={alt}/>
            ))}
          </div>
        </div>
      ) : (!loading && !err && (
        <div className="text-center py-12 sm:py-16 px-4 sm:px-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-gray-400 text-xl sm:text-2xl">🔍</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No alternatives found</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            We couldn't find any alternatives for "{name}". Try searching with a different medicine name.
          </p>
          <button 
            onClick={() => window.history.back()} 
            className="px-5 sm:px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 cursor-pointer text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            Go Back to Search
          </button>
        </div>
      ))}
    </div>
  );
}