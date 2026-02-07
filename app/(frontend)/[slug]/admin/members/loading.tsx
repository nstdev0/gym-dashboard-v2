import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/ui/skeletons/data-table-skeleton";

export default function Loading() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Admin" }, { label: "Miembros" }]}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          {/* The view page only had 2 stats, but the skeleton requirement requested grid of 3 or similar to page. 
                The prompt said: "Stats Cards (Grid de 3)". 
                However the Member View Page only has 2 cards.
                I will follow the layout of the Member Page which has 2 cards for Members, 
                BUT the prompt explicitly said "Stats Cards (Grid de 3)" in the example structure.
                I'll stick to 3 to be safe as per "Estructura Visual del loading.tsx" instruction, 
                or better yet, match the actual page. 
                The prompt says "replique exactamente el layout de la página real pero con Skeletons".
                The actual page has: grid-cols-1 sm:grid-cols-3. And maps 2 items.
                I will render 3 skeletons to fill the grid visually as a nice loading state. 
            */}
          <Skeleton className="h-24 rounded-xl" />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        {/* Table */}
        <Card>
          <DataTableSkeleton rowCount={10} columnCount={5} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
