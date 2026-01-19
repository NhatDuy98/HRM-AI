import {
    Download,
    Printer,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { StaffMovementRow } from "@/services/admin.service";

interface StaffMovementTableProps {
    data?: StaffMovementRow[];
}

export function StaffMovementTable({ data }: StaffMovementTableProps) {
    // Fallback if no data provided (or remove fallback to enforce strictness)
    // For now, if data is empty or undefined, show empty state or handle gracefully.
    // But since AdminDashboardPage fetches it, let's render passed data.
    const displayData = data || []; // Not using mock fallback anymore for strict API

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Staff Movement Trends</h3>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 px-3 text-xs gap-2 font-medium">
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                    </Button>
                    <Button variant="outline" className="h-9 px-3 text-xs gap-2 font-medium">
                        <Printer className="h-3.5 w-3.5" />
                        Print PDF
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="text-[10px] text-slate-400 uppercase font-bold bg-slate-50/50 border-b border-slate-100 tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Inbound (New)</th>
                            <th className="px-6 py-4">Outbound (Exit)</th>
                            <th className="px-6 py-4">Net Growth</th>
                            <th className="px-6 py-4">Churn Rate</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {displayData.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-6 text-slate-500">No movement data</td></tr>
                        ) : (
                            displayData.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 text-sm">
                                        {row.department}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        {row.inbound}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        {row.outbound}
                                    </td>
                                    <td className={cn(
                                        "px-6 py-4 font-bold",
                                        row.netGrowth > 0 ? "text-emerald-500" : "text-red-500"
                                    )}>
                                        {row.netGrowth > 0 ? "+" : ""}{row.netGrowth}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        {row.churnRate}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Badge className={cn(
                                            "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-0",
                                            row.status === "STABLE" && "bg-emerald-100 text-emerald-700",
                                            row.status === "EXPANDING" && "bg-sky-100 text-sky-700",
                                            row.status === "CRITICAL" && "bg-red-100 text-red-700"
                                        )}>
                                            {row.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                    Showing data for 4 main units
                </span>
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0FA3B1] text-white shadow-sm shadow-cyan-200 text-xs font-bold">
                        1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
