import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/ui/skeletons/data-table-skeleton";

export default function Loading() {
    return (
        <DashboardLayout breadcrumbs={[{ label: "Admin" }, { label: "Membresías" }]}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-[180px]" />
                </div>

                {/* Table */}
                <Card>
                    <DataTableSkeleton rowCount={10} columnCount={6} />
                </Card>
            </div>
        </DashboardLayout>
    );
}
