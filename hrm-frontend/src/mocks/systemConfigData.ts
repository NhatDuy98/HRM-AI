export interface ConfigItem {
    id: string; // e.g. "UNT-001"
    name: string; // e.g. "Executive Board"
    description: string;
    status: "Active" | "Inactive";
}

export type ConfigTab = "Organizational Units" | "System Roles" | "Data Tags" | "Locations";

export const CONFIG_TABS: ConfigTab[] = [
    "Organizational Units",
    "System Roles",
    "Data Tags",
    "Locations"
];

export const ORGANIZATIONAL_UNITS: ConfigItem[] = [
    {
        id: "UNT-001",
        name: "Executive Board",
        description: "Primary decision making body for the union.",
        status: "Active"
    },
    {
        id: "UNT-002",
        name: "Regional Branch Office",
        description: "Standard classification for state-level divisions.",
        status: "Active"
    },
    {
        id: "UNT-003",
        name: "Legal Committee",
        description: "Specialized unit for labor law compliance.",
        status: "Inactive"
    },
    // Adding extra mocks for pagination demo if needed
    {
        id: "UNT-004",
        name: "Finance Department",
        description: "Handles all internal and external financial auditing.",
        status: "Active"
    },
    {
        id: "UNT-005",
        name: "IT Support",
        description: "Technical infrastructure and helpdesk services.",
        status: "Active"
    }
];

// Placeholder for other tabs if we were to implement them fully
export const MOCK_OTHER_DATA: ConfigItem[] = [
    { id: "ROLE-001", name: "System Admin", description: "Full access", status: "Active" },
    { id: "TAG-001", name: "Confidential", description: "Sensitive data", status: "Active" },
];
