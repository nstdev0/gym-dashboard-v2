import { CreateOrganizationSchema } from "@/server/application/dtos/organizations.dto";
import { ICreateOrganizationUseCase } from "@/server/application/use-cases/organizations/create-organization.use-case";
import { ValidationError } from "@/server/domain/errors/common";

export class CreateOrganizationsController {
  constructor(
    private readonly createOrganizationUseCase: ICreateOrganizationUseCase,
  ) {}

  async execute(input: unknown) {
    const validatedInput = CreateOrganizationSchema.safeParse(input);

    if (!validatedInput.success) {
      throw new ValidationError(
        "Datos inválidos",
        validatedInput.error.message,
      );
    }

    return await this.createOrganizationUseCase.execute(validatedInput.data);
  }
}
