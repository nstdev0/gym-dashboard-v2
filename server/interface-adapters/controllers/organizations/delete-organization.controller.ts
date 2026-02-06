import { IDeleteOrganizationUseCase } from "@/server/application/use-cases/organizations/delete-organization.use-case";
import { Organization } from "@/server/domain/entities/Organization";
import { BadRequestError } from "@/server/domain/errors/common";
import { ControllerExecutor } from "@/server/lib/api-handler";

export class DeleteOrganizationController implements ControllerExecutor<void, Organization | null> {
  constructor(private readonly useCase: IDeleteOrganizationUseCase) { }

  async execute(input: void, id?: string) {
    if (!id) {
      throw new BadRequestError("No se proporcionó un id");
    }
    return this.useCase.execute(id);
  }
}
