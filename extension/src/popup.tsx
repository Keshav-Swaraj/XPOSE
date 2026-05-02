import "~style.css"

function IndexPopup() {
  return (
    <div className="w-80 bg-white font-sans flex flex-col shadow-xl border-t-4 border-blue-600">
      <div className="bg-gray-50 p-5 border-b">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <span className="text-2xl">🌬️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">XPOSE</h1>
            <p className="text-xs text-green-600 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
              Guardian Active
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mt-2">
          Your personal shield against hidden fees and deceptive financial jargon.
        </p>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Money Saved</p>
            <p className="text-2xl font-bold text-gray-800">₹0</p>
          </div>
          <div className="text-3xl opacity-50">🛡️</div>
        </div>

        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          onClick={() => {
            // Future: open full web dashboard
            window.open("https://xpose.in", "_blank")
          }}
        >
          <span>Open Dashboard</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </button>
      </div>

      <div className="bg-gray-100 p-3 text-center text-xs text-gray-500 border-t">
        XPOSE v1.0 • Sprint 1
      </div>
    </div>
  )
}

export default IndexPopup
