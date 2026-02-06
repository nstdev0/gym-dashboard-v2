"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { User } from "@/server/domain/entities/User";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { UsersTable } from "./users-table";
import { PageableResponse } from "@/server/shared/common/pagination";
import Loading from "../loading";
import { FilterConfiguration } from "@/components/ui/smart-filters";
import { useParams } from "next/navigation";
import SmartFilters from "@/components/ui/smart-filters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface UsersViewPageProps {
    paginatedUsers: PageableResponse<User>;
}

export default function UsersViewPage({
    paginatedUsers,
}: UsersViewPageProps) {
    const {
        records: users,
        currentPage,
        totalPages,
        totalRecords,
    } = paginatedUsers;

    const params = useParams();
    const slug = params.slug as string;

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
                    { label: "Propietario", value: "owner" },
                    { label: "Administrador", value: "admin" },
                    { label: "STAFF", value: "staff" },
                    { label: "Entrenador", value: "trainer" }
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


                    {/* ⚠️ ADVERTENCIA DE LÓGICA: 
                        Estas estadísticas solo reflejan la página actual (ej. 10 usuarios), 
                        NO el total de la base de datos. 
                        Para hacerlo bien, el backend debería devolver un objeto 'stats' junto con la paginación.
                    */}
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
                                    {stat.value}
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
                        <UsersTable users={users} />
                        <div className="p-2 border-t bg-background">
                            <Pagination currentPage={currentPage} totalPages={totalPages} />
                        </div>
                    </Card>
                </div>
            </DashboardLayout>
        </Suspense>
    );
}