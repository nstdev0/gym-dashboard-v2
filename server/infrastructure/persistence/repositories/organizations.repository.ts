import { Prisma } from "@/generated/prisma/client";
import { BaseRepository } from "./base.repository";
import { Organization } from "@/server/domain/entities/Organization";
import {
  IOrganizationRepository,
  OrganizationsFilters,
} from "@/server/application/repositories/organizations.repository.interface";
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "@/server/domain/types/organizations";

export class OrganizationsRepository
  extends BaseRepository<
    Prisma.OrganizationDelegate,
    Organization,
    CreateOrganizationInput,
    UpdateOrganizationInput,
    OrganizationsFilters
  >
  implements IOrganizationRepository
{
  async buildQueryFilters(
    filters: OrganizationsFilters,
  ): Promise<Prisma.OrganizationWhereInput> {
    const whereClause: Prisma.OrganizationWhereInput = {};

    if (filters.search) {
      const searchTerms = filters.search.trim().split(/\s+/).filter(Boolean);

      if (searchTerms.length > 0) {
        whereClause.AND = searchTerms.map((term) => ({
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { email: { contains: term, mode: "insensitive" } },
          ],
        }));
      }
    }
    return whereClause;
  }
}
