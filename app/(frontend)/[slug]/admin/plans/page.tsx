import { getContainer } from "@/server/di/container";
import PlansViewPage from "./components/view-page";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PlansPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const search = (params.search as string) || undefined;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const container = await getContainer();

    const paginatedPlans = await container.getAllPlansController.execute({
        page,
        limit,
        filters: {
            search,
            status: (params.status as string) || undefined,
            sort: (params.sort as string) || undefined,
        },
    });

    return <PlansViewPage paginatedPlans={paginatedPlans} />;
}
