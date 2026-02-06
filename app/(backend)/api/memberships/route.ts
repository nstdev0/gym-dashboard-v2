import { createMembershipSchema } from "@/server/application/dtos/memberships.dto";
import { createContext } from "@/server/lib/api-handler";
import { parsePagination } from "@/server/shared/utils/pagination-parser";

export const GET = createContext(
  (c) => c.getAllMembershipsController,
  async (req) => parsePagination(req)
);

export const POST = createContext(
  (c) => c.createMembershipController,
  async (req) => {
    const body = await req.json();
    return createMembershipSchema.parse(body);
  }
);
