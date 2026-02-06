import { getContainer } from "@/server/di/container";
import UsersViewPage from "./components/view-page";
import { Role } from "@/generated/prisma/enums";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ slug: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const search = (params.search as string) || undefined;
    const sort = (params.sort as string) || undefined
    const role = (params.role as string) || undefined
    const status = (params.status as string) || undefined
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const container = await getContainer();

    const paginatedUsers = await container.getAllUsersController.execute({
        page,
        limit,
        filters: {
            search: search,
            sort: sort,
            role: role,
            status: status
        },
    });

    return <UsersViewPage paginatedUsers={paginatedUsers} />;
}
