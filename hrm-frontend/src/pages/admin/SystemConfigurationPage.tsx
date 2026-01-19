import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
    CONFIG_TABS,
    ORGANIZATIONAL_UNITS,
    MOCK_OTHER_DATA,
    type ConfigTab
} from "@/mocks/systemConfigData";

export function SystemConfigurationPage() {
    const [activeTab, setActiveTab] = useState<ConfigTab>("Organizational Units");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Select data based on tab (Mock logic)
    const currentData = activeTab === "Organizational Units" ? ORGANIZATIONAL_UNITS : MOCK_OTHER_DATA;

    // Pagination logic
    const totalPages = Math.ceil(currentData.length / pageSize);
    const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage master data categories, organizational units, and system roles.
                    </p>
                </div>
                <Button className="bg-[#0FA3B1] hover:bg-[#0e8a95] text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Entry
                </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex space-x-8">
                    {CONFIG_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={cn(
                                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                                activeTab === tab
                                    ? "border-[#0FA3B1] text-[#0FA3B1]"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-slate-400 uppercase font-bold bg-slate-50/50 border-b border-slate-200 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Unit ID</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No entries found for {activeTab}.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {item.id}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {item.description}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge className={cn(
                                                "rounded-full px-3 py-0.5 border-0 font-bold text-[10px] tracking-wide",
                                                item.status === "Active"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                            )}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 text-slate-400 hover:text-[#0FA3B1] hover:bg-cyan-50 rounded transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Matching Image Style) */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-semibold">{Math.min(currentPage * pageSize, currentData.length)}</span> of <span className="font-semibold">{currentData.length}</span> entries
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
