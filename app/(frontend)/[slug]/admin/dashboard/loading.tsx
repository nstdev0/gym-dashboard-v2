import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <DashboardLayout breadcrumbs={[{ label: "Admin" }, { label: "Dashboard" }]}>
            <div className="flex flex-col space-y-4 sm:space-y-6 overflow-auto pb-4 scrollbar-hide">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-[280px]" />
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardContent className="px-4 sm:px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* KPI Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Revenue Chart */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-8 w-32" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>

                    {/* Popular Plans */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Expirations */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Members */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
