import { Organization } from "@/server/domain/entities/Organization";
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "@/server/domain/types/organizations";
import { IBaseRepository } from "./base.repository.interface";

export interface OrganizationsFilters {
  search?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOrganizationRepository extends IBaseRepository<
  Organization,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  OrganizationsFilters
> {}
