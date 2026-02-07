"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { User } from "@/server/domain/entities/User";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { UsersTable } from "./users-table";
import Loading from "../loading";
import { FilterConfiguration } from "@/components/ui/smart-filters";
import { useParams, useSearchParams } from "next/navigation";
import SmartFilters from "@/components/ui/smart-filters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useUsersList } from "@/hooks/users/use-users";

export default function UsersViewPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const role = searchParams.get("role") || undefined;
    const status = searchParams.get("status") || undefined;

    const { data: paginatedUsers, isLoading } = useUsersList({
        page,
        limit,
        search,
        sort,
        role,
        status,
    });

    const users = paginatedUsers?.records || [];
    const totalPages = paginatedUsers?.totalPages || 0;
    const totalRecords = paginatedUsers?.totalRecords || 0;

    const filtersConfig: FilterConfiguration<User> = {
        sort: [
            {
                label: "Nombres (A-Z)",
                field: "firstName",
                value: "firstName-asc"
            },
            {
                label: "Nombres (Z-A)",
                field: "firstName",
                value: "firstName-desc"
            }
        ],

        filters: [
            {
                key: "role",
                label: "Rol",
                options: [
                    { label: "Propietario", value: "OWNER" },
                    { label: "Administrador", value: "ADMIN" },
                    { label: "STAFF", value: "STAFF" },
                    { label: "Entrenador", value: "TRAINER" }
                ]
            },
            {
                key: "status",
                label: "Estado",
                options: [
                    { label: "Activo", value: "active" },
                    { label: "Inactivo", value: "inactive" }
                ]
            }
        ]
    }

    return (
        <Suspense fallback={<Loading />}>
            <DashboardLayout
                breadcrumbs={[{ label: "Dashboard", href: `/${slug}/admin/dashboard` }, { label: "Usuarios" }]}
            >
                <PageHeader
                    title="Gestión de Usuarios"
                    description="Administra los usuarios de tu gimnasio"
                    actions={
                        <Link href={`/${slug}/admin/users/new`}>
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nuevo Usuario
                            </Button>
                        </Link>
                    }
                />
                <div className="flex flex-col h-full space-y-4 overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Total Usuarios", value: totalRecords.toString() },
                            { label: "En esta página", value: users.length.toString() },
                            // { label: "Admins", value: ??? } <- Necesitas dato del backend
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
                        {/* SearchInput necesita Suspense boundary, pero como toda la pagina 
                            esta envuelta, funcionará bien. */}
                        <SearchInput placeholder="Buscar por nombres, email..." />
                        <SmartFilters config={filtersConfig} />
                    </div>

                    <Card className="flex-1 overflow-hidden flex flex-col min-h-0">
                        {isLoading ? (
                            <div className="p-4 flex justify-center items-center h-full">Cargando...</div>
                        ) : (
                            <>
                                <UsersTable users={users} />
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