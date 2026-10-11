export default function Map() {
  return (
    <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
      {/* Header Bar */}
      <div className="p-3 bg-slate-950 flex justify-between items-center border-b border-slate-800">
        <span className="text-xs font-bold text-amber-400 tracking-wider">AURANGABAD SATELLITE MAP</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-medium">Live Tracking</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>

      {/* Real Interactive Satellite Map Container */}
      <div className="relative w-full h-80 bg-slate-900">
        <iframe
          title="Chhatrapati Sambhajinagar Satellite Map"
          src="https://maps.google.com/maps?q=Chhatrapati+Sambhajinagar,Maharashtra&t=k&z=13&output=embed"
          className="w-full h-full border-0"
          allowFullScreen={false}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  )
}