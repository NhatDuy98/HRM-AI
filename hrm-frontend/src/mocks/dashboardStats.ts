export interface DashboardStat {
    id: string;
    label: string;
    value: string | number;
    subValue?: string; // e.g. "87.2% Rate" or "This Quarter"
    trend?: string; // e.g. "+2.4%"
    trendDirection?: 'up' | 'down' | 'neutral';
    subText?: string; // e.g. "Vs. previous period"
    type: 'basic' | 'progress' | 'segmented';
    iconType: 'users' | 'active' | 'inactive' | 'new';
}

export const DASHBOARD_STATS: DashboardStat[] = [
    {
        id: 'total-personnel',
        label: 'TOTAL PERSONNEL',
        value: '12,842',
        trend: '+2.4%',
        trendDirection: 'up',
        subText: 'Vs. previous period',
        type: 'basic',
        iconType: 'users'
    },
    {
        id: 'active-status',
        label: 'ACTIVE STATUS',
        value: '11,204',
        subValue: '87.2% Rate',
        type: 'progress',
        iconType: 'active'
    },
    {
        id: 'inactive-retired',
        label: 'INACTIVE/RETIRED',
        value: '1,638',
        trend: '↑ 0.8%',
        trendDirection: 'neutral', // Yellow/Orange in image
        subText: 'Natural attrition cycle',
        type: 'basic',
        iconType: 'inactive'
    },
    {
        id: 'new-registrations',
        label: 'NEW REGISTRATIONS',
        value: '482',
        subValue: 'This Quarter',
        type: 'segmented',
        iconType: 'new'
    }
];

export const EDUCATION_DATA = [
    { label: 'Doctorate/PhD', percentage: 40, color: '#0FA3B1' }, // Main Teal
    { label: "Master's Degree", percentage: 25, color: '#60A5FA' }, // Blue
    { label: "Bachelor's/Higher", percentage: 35, color: '#94A3B8' }, // Slate
];

export interface StaffMovementRow {
    department: string;
    inbound: number;
    outbound: number;
    netGrowth: number;
    churnRate: string;
    status: 'STABLE' | 'EXPANDING' | 'CRITICAL';
}

export const STAFF_MOVEMENT_DATA: StaffMovementRow[] = [
    {
        department: 'Administrative Services',
        inbound: 24,
        outbound: 8,
        netGrowth: 16,
        churnRate: '3.2%',
        status: 'STABLE'
    },
    {
        department: 'Technical & Engineering',
        inbound: 42,
        outbound: 12,
        netGrowth: 30,
        churnRate: '1.8%',
        status: 'EXPANDING'
    },
    {
        department: 'Legal Affairs',
        inbound: 6,
        outbound: 14,
        netGrowth: -8,
        churnRate: '9.4%',
        status: 'CRITICAL'
    },
    {
        department: 'Research & Development',
        inbound: 18,
        outbound: 4,
        netGrowth: 14,
        churnRate: '2.1%',
        status: 'STABLE'
    }
];
