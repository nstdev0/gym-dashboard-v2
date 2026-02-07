"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Plan } from "@/server/domain/entities/Plan";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import Loading from "../loading";
import { useParams, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { PlansTable } from "./plans-table";
import SmartFilters, { FilterConfiguration } from "@/components/ui/smart-filters";
import { usePlansList } from "@/hooks/plans/use-plans";

export default function PlansViewPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const status = searchParams.get("status") || undefined;

    const { data: paginatedPlans, isLoading } = usePlansList({
        page,
        limit,
        search,
        sort,
        status,
    });

    const plans = paginatedPlans?.records || [];
    const totalPages = paginatedPlans?.totalPages || 0;
    const totalRecords = paginatedPlans?.totalRecords || 0;

    // Logic for active plans count if backend doesn't provide it separately
    // Note: This only counts loaded active plans, ideally backend provides stats
    const activePlansCount = plans.filter(p => p.isActive).length;

    const filtersConfig: FilterConfiguration<Plan> = {
        sort: [
            { label: "Precio (Mayor a Menor)", field: "price", value: "price-desc" },
            { label: "Precio (Menor a Mayor)", field: "price", value: "price-asc" },
            { label: "Duración (Mayor a Menor)", field: "durationDays", value: "durationDays-desc" },
            { label: "Duración (Menor a Mayor)", field: "durationDays", value: "durationDays-asc" },
            { label: "Nombre (A-Z)", field: "name", value: "name-asc" },
        ],
        filters: [
            {
                key: "status",
                label: "Estado",
                options: [
                    { label: "Activo", value: "active" },
                    { label: "Inactivo", value: "inactive" },
                ],
            },
        ],
    };

    return (
        <Suspense fallback={<Loading />}>
            <DashboardLayout
                breadcrumbs={[
                    { label: "Admin", href: `/${slug}/admin/dashboard` },
                    { label: "Planes" },
                ]}
            >
                <PageHeader
                    title="Gestión de Planes"
                    description="Administra los planes de membresía de tu gimnasio"
                    actions={
                        <Link href={`/${slug}/admin/plans/new`}>
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nuevo Plan
                            </Button>
                        </Link>
                    }
                />
                <div className="flex flex-col h-full space-y-4 overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Total Planes", value: totalRecords.toString() },
                            // Need real stats from backend for total active plans
                            { label: "Planes Activos (Página Actual)", value: activePlansCount.toString() },
                            { label: "En esta página", value: plans.length.toString() },
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

                    <div className="flex flex-col sm:flex-row gap-2">
                        <SearchInput placeholder="Buscar por nombre..." />
                        <SmartFilters config={filtersConfig} />
                    </div>

                    <Card className="flex-1 overflow-hidden flex flex-col min-h-0">
                        {isLoading ? (
                            <div className="p-4 flex justify-center items-center h-full">Cargando...</div>
                        ) : (
                            <>
                                <PlansTable plans={plans} />
                                <div className="p-2 border-t bg-background">
                                    <Pagination currentPage={page} totalPages={totalPages} />
                                </div>
                            </>
                        )}

                    </Card>
                </div>
            </DashboardLayout>
        </Suspense>
    );
}
