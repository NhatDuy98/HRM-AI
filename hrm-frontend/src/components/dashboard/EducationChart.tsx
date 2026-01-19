export function EducationChart() {
    return (
        <div className="relative flex items-center justify-center h-64">
            {/* Mock Donut Chart (SVG) */}
            <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="10" />

                {/* Doctorate segment (40%) - Teal */}
                <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    stroke="#0FA3B1"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="150.72"
                    className="transform origin-center transition-all duration-1000 ease-out"
                />

                {/* Bachelors segment (35%) - Slate - Start after Teal */}
                <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    stroke="#CBD5E1"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="213.52" // 15% remaining dash to show? No, this is tricky manually.
                // Doing a simplified visual approximation for the mock
                />
                {/* Actually, simplified solid segments for stability in mock */}
                {/* Segment 1: 40% (Teal) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0FA3B1" strokeWidth="10" strokeDasharray="100 151" strokeDashoffset="0" />

                {/* Segment 2: 25% (Blue) - Start at 40% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#60A5FA" strokeWidth="10" strokeDasharray="63 188" strokeDashoffset="-100" />
            </svg>

            {/* Center Text */}
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-slate-900">100%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified</span>
            </div>
        </div>
    );
}

// Improved version with cleaner SVG logic
export function EducationChartMock() {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl h-full">
            <h3 className="w-full text-base font-bold text-slate-900 mb-6">Education Level</h3>

            <div className="relative w-48 h-48 mb-8">
                <svg viewBox="0 0 36 36" className="w-full h-full block">
                    <path
                        className="text-[#94A3B8]" // Bachelor - 35%
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.8"
                        strokeDasharray="35, 100" // 35%
                        style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
                    />
                    <path
                        className="text-[#60A5FA]" // Master - 25%
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.8"
                        strokeDasharray="25, 100" // 25%
                        strokeDashoffset="-35" // Offset by previous 35%
                        style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
                    />
                    <path
                        className="text-[#0FA3B1]" // PhD - 40%
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.8"
                        strokeDasharray="40, 100" // 40%
                        strokeDashoffset="-60" // Offset by 35+25 = 60
                        style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">100%</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Verified</span>
                </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0FA3B1]"></span>
                        <span className="text-slate-600 font-medium">Doctorate/PhD</span>
                    </div>
                    <span className="font-bold text-slate-900">40%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]"></span>
                        <span className="text-slate-600 font-medium">Master's Degree</span>
                    </div>
                    <span className="font-bold text-slate-900">25%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>
                        <span className="text-slate-600 font-medium">Bachelor's/Higher</span>
                    </div>
                    <span className="font-bold text-slate-900">35%</span>
                </div>
            </div>
        </div>
    );
}
