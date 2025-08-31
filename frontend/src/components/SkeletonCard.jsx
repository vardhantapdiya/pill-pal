export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-lg animate-pulse mx-2 sm:mx-0 relative">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
        {/* Medicine Info Skeleton */}
        <div className="flex-1 sm:mr-4">
          {/* Medicine Name with Icon */}
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl mr-2 sm:mr-3 flex-shrink-0"></div>
            <div className="h-4 sm:h-5 w-32 sm:w-40 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Price Skeleton */}
          <div className="mb-3">
            <div className="flex items-center">
              <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-lg mr-2"></div>
              <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Buy Button Skeleton */}
          <div className="mb-3 sm:mb-4">
            <div className="h-9 sm:h-10 w-24 sm:w-28 bg-gray-200 rounded-lg sm:rounded-xl"></div>
          </div>
        </div>

        {/* Save Button Skeleton */}
        <div className="flex flex-col items-start sm:items-end">
          <div className="h-9 sm:h-10 w-18 sm:w-20 bg-gray-200 rounded-lg sm:rounded-xl"></div>
          <div className="h-3 w-14 sm:w-16 bg-gray-200 rounded mt-1"></div>
        </div>
      </div>

      {/* Bottom Info Bar Skeleton */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="h-3 w-28 sm:w-32 bg-gray-200 rounded"></div>
          <div className="h-3 w-20 sm:w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    </div>
  );
}