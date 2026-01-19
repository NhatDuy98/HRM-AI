import { useState, useEffect } from "react";
import { Calendar, Bell, MoreVertical, Loader2 } from "lucide-react";
import { AdminService, type DashboardStat, type StaffMovementRow } from "@/services/admin.service";
import { StatCard } from "@/components/dashboard/StatCard";
import { EducationChartMock } from "@/components/dashboard/EducationChart";
import { StaffMovementTable } from "@/components/dashboard/StaffMovementTable";

export function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [movementData, setMovementData] = useState<StaffMovementRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const [statsData, movementRes] = await Promise.all([
                    AdminService.getDashboardStats(),
                    AdminService.getStaffMovement()
                ]);
                setStats(statsData);
                setMovementData(movementRes);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>;
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-500">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0FA3B1]/10 rounded-lg flex items-center justify-center text-[#0FA3B1]">
                            {/* Simplified Logo mark */}
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">System Analytics</h1>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1 ml-11">
                        Trade Union Enterprise HRMS
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Jan 1, 2024 - Dec 31, 2024</span>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-[#0FA3B1] flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                        JD
                    </div>
                </div>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.length > 0 ? stats.map(stat => (
                    <StatCard key={stat.id} stat={stat} />
                )) : (
                    <div className="col-span-full py-8 text-center text-slate-400">No stats available</div>
                )}
            </div>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">

                {/* Unit Distribution Chart (Placeholder/Mock) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                        <h3 className="font-bold text-slate-900">Unit Distribution</h3>
                        <button className="text-slate-400 hover:text-slate-600">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Empty Chart Area Representation */}
                    <div className="flex-1 border-b border-l border-slate-100 relative min-h-[200px]">
                        {/* Mock Bars (Visual only) */}
                        <div className="absolute bottom-0 left-[10%] w-[6%] h-[60%] bg-[#0FA3B1]/20 rounded-t-sm hover:bg-[#0FA3B1] transition-colors cursor-pointer group">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">Admin</div>
                        </div>
                        <div className="absolute bottom-0 left-[23%] w-[6%] h-[80%] bg-[#0FA3B1]/20 rounded-t-sm hover:bg-[#0FA3B1] transition-colors cursor-pointer group">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">Ops</div>
                        </div>
                        <div className="absolute bottom-0 left-[36%] w-[6%] h-[40%] bg-[#0FA3B1]/20 rounded-t-sm hover:bg-[#0FA3B1] transition-colors cursor-pointer group">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">Tech</div>
                        </div>
                        <div className="absolute bottom-0 left-[49%] w-[6%] h-[50%] bg-[#0FA3B1]/20 rounded-t-sm hover:bg-[#0FA3B1] transition-colors cursor-pointer group">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">Legal</div>
                        </div>
                        <div className="absolute bottom-0 left-[62%] w-[6%] h-[30%] bg-[#0FA3B1]/20 rounded-t-sm hover:bg-[#0FA3B1] transition-colors cursor-pointer group">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">Finance</div>
                        </div>
                        <div className="absolute bottom-0 left-[75%] w-[6%] h-[45%] bg-[#0FA3B1]/20 rounded-t-sm hover:bg-[#0FA3B1] transition-colors cursor-pointer group">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">Support</div>
                        </div>
                        <div className="absolute bottom-0 left-[88%] w-[6%] h-[20%] bg-[#0FA3B1]/20 rounded-t-sm hover:bg-[#0FA3B1] transition-colors cursor-pointer group">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">R&D</div>
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between px-6 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Admin</span>
                        <span>Field Ops</span>
                        <span>Tech</span>
                        <span>Legal</span>
                        <span>Finance</span>
                        <span>Support</span>
                        <span>Research</span>
                    </div>
                </div>

                {/* Education Donut Chart */}
                <div className="h-full">
                    <EducationChartMock />
                </div>
            </div>

            {/* 4. Staff Movement Table */}
            <div>
                <StaffMovementTable data={movementData} />
            </div>
        </div>
    );
}
