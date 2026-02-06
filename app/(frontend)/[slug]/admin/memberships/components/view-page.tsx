"use client";

import { Plus } from "lucide-react";
import { PageableResponse } from "@/server/shared/common/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { MembershipsTable } from "./memberships-table";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import SmartFilters, { FilterConfiguration } from "@/components/ui/smart-filters";

interface MembershipWithRelations {
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
    pricePaid: number;
    memberId: string;
    planId: string;
    member?: { firstName: string; lastName: string };
    plan?: { name: string };
    createdAt: Date;
    updatedAt: Date;
}

interface MembershipsViewPageProps {
    paginatedMemberships: PageableResponse<MembershipWithRelations>;
}

export function MembershipsViewPage({ paginatedMemberships }: MembershipsViewPageProps) {
    const params = useParams();
    const slug = params.slug as string;
    const {
        records: memberships,
        currentPage,
        totalPages,
        totalRecords,
    } = paginatedMemberships;

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
                        { label: "En esta página", value: memberships.length.toString() },
                    ].map((stat, index) => (
                        <Card key={index} className="p-3">
                            <p className="text-xs text-muted-foreground mb-1">
                                {stat.label}
                            </p>
                            <p className="text-xl font-bold text-foreground">
                                {stat.value}
                            </p>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <SearchInput placeholder="Buscar por miembro o plan..." />
                    <SmartFilters config={filtersConfig} />
                </div>

                <Card className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <MembershipsTable
                        memberships={memberships}
                        slug={slug}
                    />
                    <div className="p-2 border-t bg-background">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
