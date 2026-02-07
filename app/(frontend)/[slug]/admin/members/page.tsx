import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import MembersViewPage from "./components/view-page";
import { MembersService } from "@/lib/services/members.service";
import { memberKeys } from "@/lib/react-query/query-keys";
import { makeQueryClient } from "@/lib/react-query/client-config";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MembersPage({ searchParams }: PageProps) {
  const queryClient = makeQueryClient();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = (params.search as string) || undefined;
  const sort = (params.sort as string) || undefined;
  const membership = (params.membership as string) || undefined;

  const filters = {
    page,
    limit,
    search,
    sort,
    status: membership,
  };

  await queryClient.prefetchQuery({
    queryKey: memberKeys.list(filters),
    queryFn: () => MembersService.getAll(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MembersViewPage />
    </HydrationBoundary>
  );
}
