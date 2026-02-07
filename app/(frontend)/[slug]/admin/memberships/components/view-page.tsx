"use client";

import { Plus } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { MembershipsTable } from "./memberships-table";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import SmartFilters, { FilterConfiguration } from "@/components/ui/smart-filters";
import { useMembershipsList } from "@/hooks/memberships/use-memberships";
import { MembershipWithRelations } from "@/lib/services/memberships.service";
import Loading from "../loading";
import { Suspense } from "react";

export function MembershipsViewPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const status = searchParams.get("status") || undefined;

    const { data: paginatedMemberships, isLoading } = useMembershipsList({
        page,
        limit,
        search,
        sort,
        status,
    });

    const memberships = paginatedMemberships?.records || [];
    const totalPages = paginatedMemberships?.totalPages || 0;
    const totalRecords = paginatedMemberships?.totalRecords || 0;
    const currentRecordsCount = memberships.length;

    const filtersConfig: FilterConfiguration<MembershipWithRelations> = {
        sort: [
            { label: "Fecha Inicio (Reciente)", field: "startDate", value: "startDate-desc" },
            { label: "Fecha Inicio (Antigua)", field: "startDate", value: "startDate-asc" },
            { label: "Fecha Fin (Próxima)", field: "endDate", value: "endDate-asc" },
            { label: "Fecha Fin (Lejana)", field: "endDate", value: "endDate-desc" },
            { label: "Precio (Mayor a Menor)", field: "pricePaid", value: "pricePaid-desc" },
            { label: "Precio (Menor a Mayor)", field: "pricePaid", value: "pricePaid-asc" },
        ],
        filters: [
            {
                key: "status",
                label: "Estado",
                options: [
                    { label: "Activo", value: "ACTIVE" },
                    { label: "Vencido", value: "EXPIRED" },
                    { label: "Pendiente", value: "PENDING" },
                    { label: "Cancelado", value: "CANCELLED" },
                ],
            },
        ],
    };

    return (
        <Suspense fallback={<Loading />}>
            <DashboardLayout
                breadcrumbs={[{ label: "Admin", href: `/${slug}/admin/dashboard` }, { label: "Membresías" }]}
            >
                <PageHeader
                    title="Membresías"
                    description="Gestiona las membresías de los miembros"
                    actions={
                        <Button asChild size="sm" className="gap-2">
                            <Link href={`/${slug}/admin/memberships/new`}>
                                <Plus className="w-4 h-4" /> Nueva Membresía
                            </Link>
                        </Button>
                    }
                />

                <div className="flex flex-col h-full space-y-4 overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Total Membresías", value: totalRecords.toString() },
                            { label: "En esta página", value: currentRecordsCount.toString() },
                        ].map((stat, index) => (
                            <Card key={index} className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-xl font-bold text-foreground">
                                    {isLoading ? "..." : stat.value}
                                </p>
                            </Card>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <SearchInput placeholder="Buscar por miembro o plan..." />
                        <SmartFilters config={filtersConfig} />
                    </div>

                    <Card className="flex-1 overflow-hidden flex flex-col min-h-0">
                        {isLoading ? (
                            <div className="p-4 flex justify-center items-center h-full">Cargando...</div>
                        ) : (
                            <>
                                <MembershipsTable
                                    memberships={memberships}
                                    slug={slug}
                                />
                                <div className="p-2 border-t bg-background">
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                    />
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </DashboardLayout>
        </Suspense>
    );
}

// Export default if needed by page.tsx or dynamic import
export default MembershipsViewPage;
