export interface GetDashboardMetricsInput {
    from?: Date;
    to?: Date;
    grouping?: 'day' | 'month' | 'year';
}
