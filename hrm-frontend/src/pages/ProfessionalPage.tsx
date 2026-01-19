import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    GraduationCap,
    AlertCircle,
    Plus,
    Pencil,
    CheckCircle,
    Briefcase,
    Lightbulb,
    Trophy,
    Trash2,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { BackgroundService, type EducationItem, type SkillItem, type AchievementItem } from "@/services/background.service";

export function ProfessionalPage() {
    // --- State ---
    const [isLoading, setIsLoading] = useState(true);
    const [education, setEducation] = useState<EducationItem[]>([]);
    const [skills, setSkills] = useState<SkillItem[]>([]);
    const [achievements, setAchievements] = useState<AchievementItem[]>([]);
    const [activeSection, setActiveSection] = useState("overview");

    // Modal States
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);

    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

    const [isAchModalOpen, setIsAchModalOpen] = useState(false);
    const [editingAch, setEditingAch] = useState<AchievementItem | null>(null);

    // Delete Confirmation State
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'edu' | 'skill' | 'ach', id: string } | null>(null);

    const manualScrollRef = useRef(false);
    // const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Data Fetching ---
    const loadData = async () => {
        setIsLoading(true);
        try {
            const [eduRes, skillRes, achRes] = await Promise.all([
                BackgroundService.getEducation(),
                BackgroundService.getSkills(),
                BackgroundService.getAchievements()
            ]);
            setEducation(sortEducation(eduRes.data));
            setSkills(skillRes.data);
            setAchievements(sortAchievements(achRes.data));
        } catch (error) {
            console.error("Failed to load background data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- Helpers ---

    const sortEducation = (items: EducationItem[]) => {
        return [...items].sort((a, b) => {
            if (a.startYear !== b.startYear) {
                return parseInt(b.startYear) - parseInt(a.startYear); // Newest first usually
            }
            return 0;
        });
    };

    const sortAchievements = (items: AchievementItem[]) => {
        return [...items].sort((a, b) => b.date.localeCompare(a.date));
    };

    // --- Actions: Education ---

    const handleSaveEducation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            school: formData.get("school") as string,
            degree: formData.get("degree") as string,
            startYear: formData.get("startYear") as string,
            endYear: (formData.get("endYear") as string) || undefined,
            description: formData.get("description") as string,
        };

        try {
            if (editingEdu) {
                await BackgroundService.updateEducation(editingEdu.id, data);
            } else {
                await BackgroundService.addEducation(data);
            }
            await loadData();
            setIsEduModalOpen(false);
            setEditingEdu(null);
        } catch (error) {
            console.error("Failed to save education", error);
        }
    };

    const handleDeleteEducation = async () => {
        if (!deleteTarget) return;
        try {
            await BackgroundService.deleteEducation(deleteTarget.id);
            setEducation(prev => prev.filter(i => i.id !== deleteTarget.id));
        } catch (error) {
            console.error("Failed to delete education", error);
        } finally {
            setDeleteTarget(null);
        }
    };

    // --- Actions: Skills ---

    const handleSaveSkill = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const rawName = formData.get("name") as string;
        const normalizedName = rawName.trim();

        // Check duplicate locally for immediate feedback
        const isDuplicate = skills.some(s =>
            s.name.toLowerCase() === normalizedName.toLowerCase() &&
            s.id !== (editingSkill?.id || "")
        );

        if (isDuplicate) {
            alert("This skill already exists.");
            return;
        }

        try {
            if (editingSkill) {
                // Skills usually are just "added" or "deleted", but if we support edit:
                // await BackgroundService.updateSkill(editingSkill.id, { name: normalizedName });
                // For now, let's treat it as no-op or re-add since API simplicity
                await BackgroundService.deleteSkill(editingSkill.id);
                await BackgroundService.addSkill(normalizedName);
            } else {
                await BackgroundService.addSkill(normalizedName);
            }
            await loadData();
            setIsSkillModalOpen(false);
            setEditingSkill(null);
        } catch (error) {
            console.error("Failed to save skill", error);
        }
    };

    const handleDeleteSkill = async () => {
        if (!deleteTarget) return;
        try {
            await BackgroundService.deleteSkill(deleteTarget.id);
            setSkills(prev => prev.filter(s => s.id !== deleteTarget.id));
        } catch (error) {
            console.error("Failed to delete skill", error);
        } finally {
            setDeleteTarget(null);
        }
    };

    // --- Actions: Achievements ---

    const handleSaveAchievement = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            date: formData.get("date") as string,
            type: formData.get("type") as "ACHIEVEMENT" | "DISCIPLINARY",
        };

        try {
            if (editingAch) {
                await BackgroundService.updateAchievement(editingAch.id, data);
            } else {
                await BackgroundService.addAchievement(data);
            }
            await loadData();
            setIsAchModalOpen(false);
            setEditingAch(null);
        } catch (error) {
            console.error("Failed to save achievement", error);
        }
    };

    const handleDeleteAchievement = async () => {
        if (!deleteTarget) return;
        try {
            await BackgroundService.deleteAchievement(deleteTarget.id);
            setAchievements(prev => prev.filter(i => i.id !== deleteTarget.id));
        } catch (error) {
            console.error("Failed to delete achievement", error);
        } finally {
            setDeleteTarget(null);
        }
    };


    // --- Scroll Logic ---
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        // Fallback to window scroll if container not found or used
        if (element) {
            manualScrollRef.current = true;
            setActiveSection(id);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => { manualScrollRef.current = false; }, 1000);
        }
    };

    // Simplified Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            if (manualScrollRef.current) return;
            const sections = ["overview", "education", "skills", "achievements"];
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        // Also attach to main content area if possible, but window mostly works for full page
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const sidebarItems = [
        { id: "overview", label: "Profile Overview", icon: Briefcase },
        { id: "education", label: "Education & Training", icon: GraduationCap },
        { id: "skills", label: "Skills & Expertise", icon: Lightbulb },
        { id: "achievements", label: "Achievements", icon: Trophy },
    ];

    const getAchievementIcon = (type: string) => {
        return type === "ACHIEVEMENT" ? Trophy : AlertCircle;
    };

    const getAchievementStyles = (type: string) => {
        return type === "ACHIEVEMENT"
            ? { bg: "bg-blue-50", color: "text-blue-500" }
            : { bg: "bg-red-50", color: "text-red-500" };
    };

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div id="overview" className="scroll-mt-24">
                <nav className="flex items-center text-sm text-slate-500 mb-1">
                    <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <span className="text-slate-900 font-medium">Professional Background</span>
                </nav>
                <h1 className="text-2xl font-bold text-slate-900">Professional Background & Skills</h1>
                <p className="text-slate-500 mt-1">Manage your educational history, certifications, and union-recognized skills.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Inner Sidebar Navigation */}
                <div className="lg:col-span-1 hidden lg:block">
                    {/* Sticky Wrapper */}
                    <div className="sticky top-6 space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                                    activeSection === item.id
                                        ? "bg-white border border-slate-200 text-[#0FA3B1] shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 border border-transparent"
                                )}
                            >
                                <div className={cn("p-1 rounded transition-colors", activeSection === item.id ? "bg-[#0FA3B1]/10" : "")}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                {item.label}
                            </button>
                        ))}
                        {/* Verification Status Card */}
                        <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Verification Status</p>
                            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-2">
                                <CheckCircle className="h-4 w-4" /> Fully Verified Profile
                            </div>
                            <p className="text-xs text-emerald-600/80 leading-relaxed">Your professional records are synchronized with the central union database.</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Education Section */}
                    <Card id="education" className="scroll-mt-24">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-[#0FA3B1]" />
                                <h2 className="text-lg font-bold text-slate-900">Education History</h2>
                            </div>
                            <Button
                                className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 h-9"
                                onClick={() => { setEditingEdu(null); setIsEduModalOpen(true); }}
                            >
                                <Plus className="mr-2 h-3.5 w-3.5" /> Add Degree
                            </Button>
                        </div>
                        <CardContent className="p-8">
                            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                                {education.length === 0 ? (
                                    <div className="text-sm text-slate-400 pl-8">No education records found.</div>
                                ) : (
                                    education.map((item) => (
                                        <div key={item.id} className="relative pl-8 group">
                                            <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0FA3B1] transition-colors" />
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div className="flex-1">
                                                    <h3 className="text-base font-bold text-slate-900">{item.degree}</h3>
                                                    <p className="text-sm text-slate-600 mb-1">{item.school}</p>
                                                    {item.description && <p className="text-sm text-slate-400 italic">{item.description}</p>}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none font-mono text-xs w-fit">
                                                        {item.startYear} - {item.endYear || "Present"}
                                                    </Badge>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 hover:text-[#0FA3B1]"
                                                            onClick={() => { setEditingEdu(item); setIsEduModalOpen(true); }}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 hover:text-red-500"
                                                            onClick={() => setDeleteTarget({ type: 'edu', id: item.id })}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills Section */}
                    <Card id="skills" className="scroll-mt-24">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-[#0FA3B1]" />
                                <h2 className="text-lg font-bold text-slate-900">Skills & Core Competencies</h2>
                            </div>
                            <Button
                                className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 h-9"
                                onClick={() => { setEditingSkill(null); setIsSkillModalOpen(true); }}
                            >
                                <Plus className="mr-2 h-3.5 w-3.5" /> Add Skill
                            </Button>
                        </div>
                        <CardContent className="p-8">
                            {skills.length === 0 ? (
                                <div className="text-sm text-slate-400">No skills added yet.</div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill) => (
                                        <div key={skill.id} className="group relative px-4 py-2 bg-white border border-[#0FA3B1]/30 text-[#0FA3B1] rounded-lg text-sm font-medium hover:bg-cyan-50 transition-colors flex items-center gap-2">
                                            {skill.name}
                                            <div className="hidden group-hover:flex gap-1 ml-2 pl-2 border-l border-[#0FA3B1]/20">
                                                <button
                                                    className="hover:text-red-500"
                                                    onClick={() => setDeleteTarget({ type: 'skill', id: skill.id })}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Achievements Section */}
                    <Card id="achievements" className="scroll-mt-24">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-[#0FA3B1]" />
                                <h2 className="text-lg font-bold text-slate-900">Achievements & Records</h2>
                            </div>
                            <Button
                                className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 h-9"
                                onClick={() => { setEditingAch(null); setIsAchModalOpen(true); }}
                            >
                                <Plus className="mr-2 h-3.5 w-3.5" /> Add Record
                            </Button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {achievements.length === 0 ? (
                                <div className="p-8 text-sm text-slate-400 text-center">No achievements or records found.</div>
                            ) : (
                                achievements.map((item) => {
                                    const Icon = getAchievementIcon(item.type);
                                    const styles = getAchievementStyles(item.type);
                                    return (
                                        <div key={item.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors group">
                                            <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0", styles.bg, styles.color)}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0 hover:text-blue-500"
                                                                onClick={() => { setEditingAch(item); setIsAchModalOpen(true); }}
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0 hover:text-red-500"
                                                                onClick={() => setDeleteTarget({ type: 'ach', id: item.id })}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>

                </div>
            </div>

            {/* --- Modals --- */}

            {/* Education Modal */}
            <Modal
                isOpen={isEduModalOpen}
                onClose={() => setIsEduModalOpen(false)}
                title={editingEdu ? "Edit Education" : "Add Education"}
                className="max-w-lg"
            >
                <form onSubmit={handleSaveEducation} className="space-y-4 pt-4">
                    <Input name="school" label="School / University" defaultValue={editingEdu?.school} required placeholder="e.g. State University" />
                    <Input name="degree" label="Degree / Certificate" defaultValue={editingEdu?.degree} required placeholder="e.g. B.A. Political Science" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="startYear" label="Start Year" type="number" min="1900" max="2099" defaultValue={editingEdu?.startYear} required placeholder="YYYY" />
                        <Input name="endYear" label="End Year (Optional)" type="number" min="1900" max="2099" defaultValue={editingEdu?.endYear} placeholder="Leave blank for Present" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                        <textarea
                            name="description"
                            className="w-full min-h-[80px] rounded-md border border-slate-300 p-2 text-sm focus:border-[#0FA3B1] focus:ring-1 focus:ring-[#0FA3B1] outline-none"
                            placeholder="Honors, concentrations, etc."
                            defaultValue={editingEdu?.description}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" className="h-9" onClick={() => setIsEduModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="h-9">Save Record</Button>
                    </div>
                </form>
            </Modal>

            {/* Skills Modal */}
            <Modal
                isOpen={isSkillModalOpen}
                onClose={() => setIsSkillModalOpen(false)}
                title={editingSkill ? "Edit Skill" : "Add Skill"}
                className="max-w-md"
            >
                <form onSubmit={handleSaveSkill} className="space-y-4 pt-4">
                    <Input name="name" label="Skill Name" defaultValue={editingSkill?.name} required placeholder="e.g. Negotiation" />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" className="h-9" onClick={() => setIsSkillModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="h-9">Save Skill</Button>
                    </div>
                </form>
            </Modal>

            {/* Achievement Modal */}
            <Modal
                isOpen={isAchModalOpen}
                onClose={() => setIsAchModalOpen(false)}
                title={editingAch ? "Edit Record" : "Add Record"}
                className="max-w-lg"
            >
                <form onSubmit={handleSaveAchievement} className="space-y-4 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Record Type</label>
                        <select name="type" defaultValue={editingAch?.type || "ACHIEVEMENT"} className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-[#0FA3B1] outline-none">
                            <option value="ACHIEVEMENT">Achievement / Award</option>
                            <option value="DISCIPLINARY">Disciplinary Record</option>
                        </select>
                    </div>
                    <Input name="title" label="Title" defaultValue={editingAch?.title} required placeholder="e.g. Employee of the Month" />
                    <Input name="date" label="Date" type="month" defaultValue={editingAch?.date} required />
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            className="w-full min-h-[100px] rounded-md border border-slate-300 p-2 text-sm focus:border-[#0FA3B1] focus:ring-1 focus:ring-[#0FA3B1] outline-none"
                            defaultValue={editingAch?.description}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" className="h-9" onClick={() => setIsAchModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="h-9">Save Record</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Confirm Deletion"
                className="max-w-sm"
            >
                <div className="pt-4">
                    <div className="flex items-center gap-3 mb-4 text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">This action cannot be undone.</p>
                    </div>
                    <p className="text-slate-600 text-sm mb-6">
                        Are you sure you want to permanently delete this record?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" className="h-9" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white h-9"
                            onClick={() => {
                                if (deleteTarget?.type === 'edu') handleDeleteEducation();
                                else if (deleteTarget?.type === 'skill') handleDeleteSkill();
                                else if (deleteTarget?.type === 'ach') handleDeleteAchievement();
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
