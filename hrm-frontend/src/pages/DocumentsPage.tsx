import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, Download, Trash2, UploadCloud, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DocumentService, type Document } from "@/services/documents.service";

export function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Action State
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'download', doc: Document } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadDocuments = async () => {
        setIsLoading(true);
        try {
            const response = await DocumentService.getDocuments();
            setDocuments(response.data);
        } catch (error) {
            console.error("Failed to load documents", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                await DocumentService.uploadDocument(e.target.files[0]);
                await loadDocuments(); // Refresh list
            } catch (error) {
                console.error("Upload failed", error);
            } finally {
                setIsUploading(false);
                // Reset input
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    };

    const handleGenerateCV = async () => {
        setIsUploading(true);
        try {
            await DocumentService.generateCV();
            await loadDocuments();
        } catch (error) {
            console.error("CV Generation failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        try {
            if (confirmAction.type === 'delete') {
                await DocumentService.deleteDocument(confirmAction.doc.id);
                setDocuments(prev => prev.filter(d => d.id !== confirmAction.doc.id));
            } else if (confirmAction.type === 'download') {
                await DocumentService.downloadDocument(confirmAction.doc.id);
            }
        } catch (error) {
            console.error("Action failed", error);
        } finally {
            setConfirmAction(null);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex items-center text-sm text-slate-500 mb-1">
                        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <span className="text-slate-900 font-medium">My Documents</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900">Documents & CV</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={handleGenerateCV} disabled={isUploading} variant="outline" className="gap-2 h-10 px-4">
                        {isUploading ? "Processing..." : (
                            <>
                                <FileText className="h-4 w-4" />
                                Auto-Generate CV
                            </>
                        )}
                    </Button>
                    <div className="relative">
                        <input
                            type="file"
                            id="doc-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            ref={fileInputRef}
                        />
                        <Button onClick={triggerFileUpload} disabled={isUploading} className="gap-2 h-10 px-4">
                            <UploadCloud className="h-4 w-4" />
                            Upload Document
                        </Button>
                    </div>
                </div>
            </div>

            {/* Document List */}
            <Card className="overflow-hidden border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Document Name</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Version</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading documents...</td>
                                </tr>
                            ) : documents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No documents found</td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-slate-900">{doc.name}</div>
                                                <div className="text-xs text-slate-400">{doc.size}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{doc.type}</td>
                                        <td className="px-6 py-4 text-slate-600">{doc.version}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={
                                                doc.status === 'AUTO_GENERATED' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                                    "bg-emerald-50 text-emerald-700 border-emerald-100"
                                            }>
                                                {doc.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(doc.createdDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                                                    onClick={() => setConfirmAction({ type: 'download', doc })}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                                                    onClick={() => setConfirmAction({ type: 'delete', doc })}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Confirmation Modal (Simple overlay for now) */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            {confirmAction.type === 'delete' ? (
                                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                            ) : (
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                    <Download className="h-5 w-5 text-blue-600" />
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-slate-900">
                                {confirmAction.type === 'delete' ? 'Delete Document?' : 'Download Document?'}
                            </h3>
                        </div>

                        <p className="text-sm text-slate-500 mb-6 ml-14">
                            {confirmAction.type === 'delete'
                                ? `Are you sure you want to delete "${confirmAction.doc.name}"? This action cannot be undone.`
                                : `Do you want to download "${confirmAction.doc.name}"?`
                            }
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setConfirmAction(null)} className="h-9 px-4">Cancel</Button>
                            <Button
                                variant={confirmAction.type === 'delete' ? 'primary' : 'primary'} // Use available variants
                                className={confirmAction.type === 'delete' ? "bg-red-600 hover:bg-red-700 h-9 px-4" : "h-9 px-4"}
                                onClick={handleConfirmAction}
                            >
                                {confirmAction.type === 'delete' ? 'Delete' : 'Download'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
