export default function Disclaimer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-8 sm:mt-12 md:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Important Notice Header */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="flex items-center bg-yellow-50 border border-yellow-200 rounded-xl px-3 sm:px-4 py-2">
            <span className="text-yellow-600 mr-2 text-base sm:text-lg">⚠️</span>
            <span className="text-yellow-800 font-semibold text-xs sm:text-sm">Important Medical Disclaimer</span>
          </div>
        </div>

        {/* Main Disclaimer Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="prose prose-sm max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="mr-2">🏥</span>
                  Medical Advisory
                </h3>
                <div className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm leading-relaxed">
                  <p className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span>This app suggests brand alternatives that claim to use the same ingredients/combination.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span><strong className="text-red-600">Always consult a qualified healthcare professional before 
                      <br/>using or switching medicines.</strong></span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span><strong>This is not a professional medical advice.</strong></span>
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="mr-2">💰</span>
                  Pricing & Availability
                </h3>
                <div className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm leading-relaxed">
                  <p className="flex items-start">
                    <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span>Prices shown are informational and may vary by location and pharmacy.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span>Medicine availability may differ across regions and stores.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span>External links are provided for convenience only.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <p className="text-blue-800 text-xs sm:text-sm font-medium">
                <span className="mr-2">👨‍⚕️</span>
                For any medical concerns or questions about medicine alternatives, 
                <strong> please consult your doctor or pharmacist.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-gray-500 mb-3 sm:mb-4">
            <span className="flex items-center">
              <span className="mr-1">🛡️</span>
              Your safety is our priority
            </span>
            <span className="flex items-center">
              <span className="mr-1">💊</span>
              Alternative medicine finder
            </span>
            <span className="flex items-center">
              <span className="mr-1">💰</span>
              Cost-effective healthcare
            </span>
          </div>
          
          <p className="text-xs text-gray-400 px-4 sm:px-0">
            © 2025 Medicine Alternative Finder. This tool is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}