import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MembershipsViewPage } from "./components/view-page"; // Named import
import { MembershipsService } from "@/lib/services/memberships.service";
import { membershipKeys } from "@/lib/react-query/query-keys";
import { makeQueryClient } from "@/lib/react-query/client-config";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MembershipsPage({ searchParams }: PageProps) {
    const queryClient = makeQueryClient();
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = (params.search as string) || undefined;
    const sort = (params.sort as string) || undefined;
    const status = (params.status as string) || undefined;
    const planId = (params.planId as string) || undefined;
    const memberId = (params.memberId as string) || undefined;

    const filters = {
        page,
        limit,
        search,
        sort,
        status,
        planId,
        memberId,
    };

    await queryClient.prefetchQuery({
        queryKey: membershipKeys.list(filters),
        queryFn: () => MembershipsService.getAll(filters),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MembershipsViewPage />
        </HydrationBoundary>
    );
}
