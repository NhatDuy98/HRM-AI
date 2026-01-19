import { API_CONFIG } from "@/config/api.config";
import { httpClient, mockDelay } from "@/lib/api-client";
import type { ListResponse } from "@/types/api";

export interface EducationItem {
    id: string;
    degree: string;
    school: string;
    startYear: string;
    endYear?: string;
    description?: string;
}

export interface SkillItem {
    id: string;
    name: string;
}

export interface AchievementItem {
    id: string;
    title: string;
    description: string;
    date: string;
    type: "ACHIEVEMENT" | "DISCIPLINARY";
}

// Mock Data Stores
let MOCK_EDUCATION: EducationItem[] = [
    {
        id: "1",
        degree: "Master of Public Administration",
        school: "Metropolitan University of Technology",
        startYear: "2018",
        endYear: "2020",
        description: "Concentration in Labor Relations & Policy",
    },
    {
        id: "2",
        degree: "B.A. in Political Science",
        school: "State Institute of Social Sciences",
        startYear: "2012",
        endYear: "2016",
        description: "Graduated with Honors",
    },
];

let MOCK_SKILLS: SkillItem[] = [
    "Collective Bargaining",
    "Conflict Resolution",
    "Labor Law Compliance",
    "Strategic Communication",
    "Public Relations",
    "Policy Analysis",
    "Crisis Management",
    "Budgeting",
].map((s, i) => ({ id: i.toString(), name: s }));

let MOCK_ACHIEVEMENTS: AchievementItem[] = [
    {
        id: "1",
        title: "Excellence in Negotiation Award",
        description: "Awarded for the successful negotiation of the 2023 Municipal Labor Agreement affecting 2,500 workers.",
        date: "2023-10",
        type: "ACHIEVEMENT",
    },
    {
        id: "2",
        title: "Certified Labor Relations Specialist",
        description: "Professional certification issued by the National Labor Academy.",
        date: "2022-03",
        type: "ACHIEVEMENT",
    },
    {
        id: "3",
        title: "Incident Report: Late Submission",
        description: "Minor administrative oversight: Monthly union dues report submitted 48 hours past deadline. Resolved with training.",
        date: "2021-01",
        type: "DISCIPLINARY",
    },
];

export const BackgroundService = {
    // --- Education ---
    getEducation: async (): Promise<ListResponse<EducationItem>> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            return { data: [...MOCK_EDUCATION], meta: { total: MOCK_EDUCATION.length, page: 1, limit: 100, totalPage: 1 } };
        }
        return httpClient.get<ListResponse<EducationItem>>("/background/education");
    },

    addEducation: async (item: Omit<EducationItem, "id">): Promise<EducationItem> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(800);
            const newItem = { ...item, id: Date.now().toString() };
            MOCK_EDUCATION.unshift(newItem);
            return newItem;
        }
        return httpClient.post<EducationItem>("/background/education", item);
    },

    updateEducation: async (id: string, item: Partial<EducationItem>): Promise<EducationItem> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(800);
            MOCK_EDUCATION = MOCK_EDUCATION.map(e => e.id === id ? { ...e, ...item } : e);
            return MOCK_EDUCATION.find(e => e.id === id)!;
        }
        return httpClient.patch<EducationItem>(`/background/education/${id}`, item);
    },

    deleteEducation: async (id: string): Promise<void> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(500);
            MOCK_EDUCATION = MOCK_EDUCATION.filter(e => e.id !== id);
            return;
        }
        return httpClient.delete(`/background/education/${id}`);
    },

    // --- Skills ---
    getSkills: async (): Promise<ListResponse<SkillItem>> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(400);
            return { data: [...MOCK_SKILLS], meta: { total: MOCK_SKILLS.length, page: 1, limit: 100, totalPage: 1 } };
        }
        return httpClient.get<ListResponse<SkillItem>>("/background/skills");
    },

    addSkill: async (name: string): Promise<SkillItem> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            const newItem = { id: Date.now().toString(), name };
            MOCK_SKILLS.push(newItem);
            return newItem;
        }
        return httpClient.post<SkillItem>("/background/skills", { name });
    },

    deleteSkill: async (id: string): Promise<void> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(400);
            MOCK_SKILLS = MOCK_SKILLS.filter(s => s.id !== id);
            return;
        }
        return httpClient.delete(`/background/skills/${id}`);
    },

    // --- Achievements ---
    getAchievements: async (): Promise<ListResponse<AchievementItem>> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            return { data: [...MOCK_ACHIEVEMENTS], meta: { total: MOCK_ACHIEVEMENTS.length, page: 1, limit: 100, totalPage: 1 } };
        }
        return httpClient.get<ListResponse<AchievementItem>>("/background/achievements");
    },

    addAchievement: async (item: Omit<AchievementItem, "id">): Promise<AchievementItem> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(800);
            const newItem = { ...item, id: Date.now().toString() };
            MOCK_ACHIEVEMENTS.unshift(newItem);
            return newItem;
        }
        return httpClient.post<AchievementItem>("/background/achievements", item);
    },

    updateAchievement: async (id: string, item: Partial<AchievementItem>): Promise<AchievementItem> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(800);
            MOCK_ACHIEVEMENTS = MOCK_ACHIEVEMENTS.map(a => a.id === id ? { ...a, ...item } : a);
            return MOCK_ACHIEVEMENTS.find(a => a.id === id)!;
        }
        return httpClient.patch<AchievementItem>(`/background/achievements/${id}`, item);
    },

    deleteAchievement: async (id: string): Promise<void> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(500);
            MOCK_ACHIEVEMENTS = MOCK_ACHIEVEMENTS.filter(a => a.id !== id);
            return;
        }
        return httpClient.delete(`/background/achievements/${id}`);
    }
};
