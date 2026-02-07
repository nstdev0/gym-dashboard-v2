import { createPlanSchema } from "@/server/application/dtos/plans.dto";
import { PlansFilters } from "@/server/application/repositories/plans.repository.interface";
import { createContext } from "@/server/lib/api-handler";
import { PageableRequest } from "@/server/shared/common/pagination";
import { parsePagination } from "@/server/shared/utils/pagination-parser";

export const GET = createContext(
  (c) => c.getAllPlansController,
  async (req): Promise<PageableRequest<PlansFilters>> => {
    const { page, limit } = parsePagination(req);
    const { search, sort, status } = Object.fromEntries(req.nextUrl.searchParams.entries());
    return {
      page,
      limit,
      filters: {
        search: search || undefined,
        sort: sort || undefined,
        status: status || undefined,
      },
    };
  }
);

export const POST = createContext(
  (c) => c.createPlanController,
  async (req) => {
    const body = await req.json();
    return createPlanSchema.parse(body);
  }
);
