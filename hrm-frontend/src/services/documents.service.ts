import { API_CONFIG } from "@/config/api.config";
import { httpClient, mockDelay } from "@/lib/api-client";
import type { ListResponse } from "@/types/api";

export type DocumentStatus = "UPLOADED" | "AUTO_GENERATED" | "PENDING";
export type DocumentType = "PDF" | "DOCX" | "CSV" | "IMAGE";

export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    version: string;
    status: DocumentStatus;
    createdDate: string; // ISO String
    size: string; // Display size string e.g. "2.4 MB"
    url?: string; // For download simulation
}

const MOCK_DOCUMENTS: Document[] = [
    {
        id: "doc-1",
        name: "Employment_Contract_2023.pdf",
        type: "PDF",
        version: "1.0",
        status: "UPLOADED",
        createdDate: "2023-01-15T10:00:00Z",
        size: "2.4 MB"
    },
    {
        id: "doc-2",
        name: "Tax_Form_W2.pdf",
        type: "PDF",
        version: "final",
        status: "UPLOADED",
        createdDate: "2023-02-01T14:30:00Z",
        size: "1.1 MB"
    },
    {
        id: "doc-3",
        name: "Auto_Generated_Resume.docx",
        type: "DOCX",
        version: "v2",
        status: "AUTO_GENERATED",
        createdDate: "2024-01-10T09:15:00Z",
        size: "850 KB"
    }
];

export const DocumentService = {
    getDocuments: async (page = 1, limit = 10): Promise<ListResponse<Document>> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            return {
                data: MOCK_DOCUMENTS,
                meta: {
                    page,
                    limit,
                    total: MOCK_DOCUMENTS.length,
                    totalPage: Math.ceil(MOCK_DOCUMENTS.length / limit)
                }
            };
        }
        const response = await httpClient.get<ListResponse<Document>>("/documents", { params: { page, limit } });
        return response; // DocumentsPage likely handles ListResponse because of pagination meta
    },

    uploadDocument: async (file: File): Promise<Document> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(1500);
            const newDoc: Document = {
                id: `doc-${Date.now()}`,
                name: file.name,
                type: file.name.split('.').pop()?.toUpperCase() as DocumentType || "PDF",
                version: "1.0",
                status: "UPLOADED",
                createdDate: new Date().toISOString(),
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
            };
            MOCK_DOCUMENTS.unshift(newDoc);
            return newDoc;
        }

        const formData = new FormData();
        formData.append("file", file);
        return httpClient.post<Document>("/documents/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    generateCV: async (): Promise<Document> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(2000);
            const cvDoc: Document = {
                id: `doc-cv-${Date.now()}`,
                name: `Generated_CV_${new Date().getFullYear()}.pdf`,
                type: "PDF",
                version: "v1.0",
                status: "AUTO_GENERATED",
                createdDate: new Date().toISOString(),
                size: "1.2 MB"
            };
            MOCK_DOCUMENTS.unshift(cvDoc);
            return cvDoc;
        }
        return httpClient.post<Document>("/documents/generate-cv");
    },

    deleteDocument: async (id: string): Promise<void> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(500);
            const index = MOCK_DOCUMENTS.findIndex(d => d.id === id);
            if (index > -1) {
                MOCK_DOCUMENTS.splice(index, 1);
            }
            return;
        }
        return httpClient.delete(`/documents/${id}`);
    },

    downloadDocument: async (id: string): Promise<void> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(800);
            console.log(`Downloading document ${id}...`);
            return;
        }
        // For real download, usually we get a presigned URL or blob
        // Implementation depends on backend. Assuming GET triggers download or returns URL.
        const res = await httpClient.get<{ url: string }>(`/documents/${id}/download`);
        if (res.url) {
            window.open(res.url, '_blank');
        }
    }
};
