import { UserCheck, UserX, Users, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/mocks/dashboardStats";

const ICONS = {
    users: Users,
    active: UserCheck,
    inactive: UserX,
    new: UserPlus
};

export function StatCard({ stat }: { stat: DashboardStat }) {
    const Icon = ICONS[stat.iconType];

    return (
        <Card className="p-6 h-[160px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {stat.label}
                </span>
                <div className="p-2 bg-slate-50 rounded-full">
                    <Icon className="h-5 w-5 text-[#0FA3B1]" />
                </div>
            </div>

            <div className="mt-2">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>

                    {stat.type === 'basic' && stat.trend && (
                        <div className={cn(
                            "flex items-center text-xs font-bold",
                            stat.trendDirection === 'up' ? "text-emerald-500" :
                                stat.trendDirection === 'down' ? "text-red-500" : "text-amber-500"
                        )}>
                            {stat.trend}
                        </div>
                    )}

                    {stat.type !== 'basic' && stat.subValue && (
                        <span className={cn(
                            "text-xs font-semibold",
                            stat.id === 'active-status' ? "text-slate-400" : "text-[#0FA3B1]"
                        )}>
                            {stat.subValue}
                        </span>
                    )}
                </div>

                <div className="mt-4">
                    {stat.type === 'basic' && (
                        <p className="text-xs text-slate-400 font-medium">{stat.subText}</p>
                    )}

                    {stat.type === 'progress' && (
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                            <div className="bg-[#0FA3B1] h-1.5 rounded-full" style={{ width: '87.2%' }}></div>
                        </div>
                    )}

                    {stat.type === 'segmented' && (
                        <div className="flex gap-1 mt-2">
                            <div className="h-1.5 flex-1 bg-[#0FA3B1] rounded-l-full"></div>
                            <div className="h-1.5 flex-1 bg-[#0FA3B1]/60"></div>
                            <div className="h-1.5 flex-1 bg-[#0FA3B1]/30"></div>
                            <div className="h-1.5 flex-1 bg-slate-200 rounded-r-full"></div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
