import { CreateOrganizationInput } from "../../dtos/organizations.dto";
import { IOrganizationRepository } from "../../repositories/organizations.repository.interface";
import { Organization } from "@/server/domain/entities/Organization";

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: CreateOrganizationInput): Promise<Organization> {
    const errors: string[] = [];

    const existingOrganization = await this.organizationRepository.findUnique({
      name: input.name,
    });

    if (existingOrganization) {
      errors.push("La organización ya existe");
    }

    const slug = input.name.toLowerCase().replace(/\s+/g, "-");

    return await this.organizationRepository.create({ ...input, slug });
  }
}

export type ICreateOrganizationUseCase = InstanceType<
  typeof CreateOrganizationUseCase
>;
