import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductsViewPage from "./components/view-page";
import { ProductsService } from "@/lib/services/products.service";
import { productKeys } from "@/lib/react-query/query-keys";
import { makeQueryClient } from "@/lib/react-query/client-config";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const queryClient = makeQueryClient();
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = (params.search as string) || undefined;
    const sort = (params.sort as string) || undefined;
    const type = (params.type as string) || undefined;
    const status = (params.status as string) || undefined;

    const filters = {
        page,
        limit,
        search,
        sort,
        type,
        status,
    };

    await queryClient.prefetchQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => ProductsService.getAll(filters),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductsViewPage />
        </HydrationBoundary>
    );
}