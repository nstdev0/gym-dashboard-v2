import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UsersViewPage from "./components/view-page";
import { UsersService } from "@/lib/services/users.service";
import { userKeys } from "@/lib/react-query/query-keys";
import { makeQueryClient } from "@/lib/react-query/client-config";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
    const queryClient = makeQueryClient();
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = (params.search as string) || undefined;
    const sort = (params.sort as string) || undefined;
    const role = (params.role as string) || undefined;
    const status = (params.status as string) || undefined;

    const filters = {
        page,
        limit,
        search,
        sort,
        role,
        status,
    };

    await queryClient.prefetchQuery({
        queryKey: userKeys.list(filters),
        queryFn: () => UsersService.getAll(filters),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UsersViewPage />
        </HydrationBoundary>
    );
}
