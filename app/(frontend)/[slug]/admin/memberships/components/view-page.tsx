"use client";

import { Plus, Filter } from "lucide-react";
import { PageableResponse } from "@/server/shared/common/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { MembershipsTable } from "./memberships-table";

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
    const currentPage = paginatedMemberships.currentPage;
    const totalPages = paginatedMemberships.totalPages;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Membresías"
                description="Gestiona las membresías de los miembros"
                actions={
                    <Button asChild>
                        <Link href={`/${slug}/admin/memberships/new`}>
                            <Plus className="mr-2 h-4 w-4" /> Nueva Membresía
                        </Link>
                    </Button>
                }
            />

            <div className="flex flex-col md:flex-row gap-4">
                <SearchInput placeholder="Buscar por miembro o plan..." />
            </div>

            <MembershipsTable
                memberships={paginatedMemberships.records}
                slug={slug}
            />

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
}
