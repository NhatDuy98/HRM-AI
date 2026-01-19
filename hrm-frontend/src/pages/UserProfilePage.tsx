
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ChevronRight,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    Edit2,
    Save,
    X,
    FolderOpen,
    Calendar as CalendarIcon,
    User,
    Activity,
    Shield
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";
import { UserProfileService, type UserProfile, type SecurityInfo, type AuditLog } from "@/services/user-profile.service";

export function UserProfilePage() {
    // State
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [security, setSecurity] = useState<SecurityInfo | null>(null);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<UserProfile>>({});

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [profileData, securityData, logsData] = await Promise.all([
                    UserProfileService.getProfile(),
                    UserProfileService.getSecurityInfo(),
                    UserProfileService.getAuditLogs()
                ]);
                setProfile(profileData);
                setFormData(profileData);
                setSecurity(securityData || null);
                setAuditLogs(logsData || []);
            } catch (error) {
                console.error("Failed to load profile data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel action: reset form data
            setFormData(profile || {});
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!profile) return;
        try {
            const updatedProfile = await UserProfileService.updateProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleChange = (field: keyof UserProfile, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading || !profile) {
        return <div className="p-8 text-center text-slate-500">Loading Profile...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex items-center text-sm text-slate-500 mb-1">
                        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <span className="text-slate-900 font-medium">My Profile</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-slate-200 shadow-sm">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-8 w-8 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">{profile.firstName} {profile.lastName}</h2>
                                        <p className="text-sm text-slate-500">{profile.position}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                                                {profile.department}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-100">
                                                Active
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={isEditing ? handleSave : handleEditToggle}
                                    className={isEditing ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800" : ""}
                                >
                                    {isEditing ? (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                                        Personal Information
                                    </h3>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Username</label>
                                        <div className="flex items-center gap-2 text-sm text-slate-700 h-9 px-3 bg-slate-50 border border-slate-100 rounded-md">
                                            <User className="h-4 w-4 text-slate-400" />
                                            {profile.username}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">First Name</label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.firstName || ""}
                                                onChange={e => handleChange("firstName", e.target.value)}
                                            />
                                        ) : (
                                            <div className="text-sm font-medium text-slate-900 p-2">{profile.firstName}</div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Last Name</label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.lastName || ""}
                                                onChange={e => handleChange("lastName", e.target.value)}
                                            />
                                        ) : (
                                            <div className="text-sm font-medium text-slate-900 p-2">{profile.lastName}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact & Work */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                                        Contact & Work
                                    </h3>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Email Address</label>
                                        <div className="flex items-center gap-2 text-sm text-slate-700 h-9 px-3 bg-slate-50 border border-slate-100 rounded-md">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            {profile.email}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Phone Number</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    className="pl-9"
                                                    value={formData.phone || ""}
                                                    onChange={e => handleChange("phone", e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-700 flex items-center gap-2 p-2">
                                                <Phone className="h-4 w-4 text-slate-400" />
                                                {profile.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Location</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    className="pl-9"
                                                    value={formData.location || ""}
                                                    onChange={e => handleChange("location", e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-700 flex items-center gap-2 p-2">
                                                <MapPin className="h-4 w-4 text-slate-400" />
                                                {profile.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 flex justify-end">
                                    <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData(profile); }}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Timeline / Audit Logs */}
                    <Card>
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#0FA3B1]" />
                            <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                        </div>
                        <div className="p-0">
                            {(auditLogs || []).length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-400">No recent activity</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {(auditLogs || []).map((log) => (
                                        <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-[#0FA3B1]" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{log.action.replace(/_/g, " ")}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString()} • {log.ipAddress}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Security & Meta */}
                <div className="space-y-6">
                    <Card>
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-emerald-600" />
                            <h3 className="text-sm font-semibold text-slate-900">Security Status</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">MFA Enabled</span>
                                <Badge variant="outline" className={security?.mfaEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500"}>
                                    {security?.mfaEnabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Last Password Change</span>
                                <span className="text-xs font-medium text-slate-900">{security?.lastPasswordChange}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Active Sessions</span>
                                <span className="text-xs font-medium text-slate-900">{security?.activeSessions} devices</span>
                            </div>
                            <Button variant="outline" className="w-full text-xs">
                                Manage Security
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            <h3 className="text-sm font-semibold text-slate-900">Work Information</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 block">Department</span>
                                <span className="text-sm font-medium text-slate-900">{profile.department}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 block">Position</span>
                                <span className="text-sm font-medium text-slate-900">{profile.position}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-500 block">Date of Joining</span>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{new Date(profile.joinDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="flex flex-col items-center justify-center p-8 text-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-12 w-12 bg-cyan-50 rounded-full flex items-center justify-center text-[#0FA3B1] mb-4">
                            <FolderOpen className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Attachments</h3>
                        <p className="text-xs text-slate-500 mb-4">View your documents</p>
                        <Link to="/documents" className="text-xs font-bold text-[#0FA3B1] hover:underline">View Documents</Link>
                    </Card>
                </div>
            </div >
        </div >
    );
}
