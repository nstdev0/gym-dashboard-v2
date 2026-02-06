import { getContainer } from "@/server/di/container";
import { Suspense } from "react";
import { MembershipsViewPage } from "./components/view-page";
import { Metadata } from "next";
import Loading from "./loading";

export const metadata: Metadata = {
    title: "Membresías",
    description: "Gestión de membresías del gimnasio",
};

interface Props {
    searchParams: Promise<{ page?: string; limit?: string; search?: string; status?: string; sort?: string }>;
}

export default async function MembershipsPage({ searchParams }: Props) {
    const params = await searchParams;
    const container = await getContainer();

    const request = {
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 10,
        filters: {
            search: params.search || undefined,
            status: params.status || undefined,
            sort: params.sort || undefined,
        },
    };

    const paginatedMemberships = await container.getAllMembershipsController.execute(request);

    return (
        <Suspense fallback={<Loading />}>
            <MembershipsViewPage paginatedMemberships={paginatedMemberships} />
        </Suspense>
    );
}
