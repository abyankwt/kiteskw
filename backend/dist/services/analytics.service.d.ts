export declare function getOverview(): Promise<{
    totalEnrollments: number;
    enrollmentsToday: number;
    enrollmentsThisMonth: number;
    totalRevenue: number;
    revenueThisMonth: number;
    totalCourses: number;
    publishedCourses: number;
    totalUsers: number;
    conversionRate: number;
    viewsToday: number;
}>;
export declare function getEnrollmentsOverTime(from: string, to: string, groupBy?: 'day' | 'week' | 'month'): Promise<{
    date: any;
    count: number;
    revenue: number;
}[]>;
export declare function getTopCourses(limit?: number): Promise<{
    id: any;
    title: any;
    category: any;
    enrollmentCount: number;
    recentEnrollments: number;
    viewCount: number;
    rating: number;
}[]>;
export declare function getRevenueByCategory(): Promise<{
    category: any;
    revenue: number;
    enrollmentCount: number;
}[]>;
//# sourceMappingURL=analytics.service.d.ts.map