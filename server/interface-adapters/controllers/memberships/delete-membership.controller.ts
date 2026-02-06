import { DeleteMembershipUseCase } from "@/server/application/use-cases/memberships/delete-membership.use-case";
import { Membership } from "@/server/domain/entities/Membership";
import { BadRequestError } from "@/server/domain/errors/common";
import { ControllerExecutor } from "@/server/lib/api-handler";

export class DeleteMembershipController implements ControllerExecutor<void, Membership | null> {
  constructor(private readonly useCase: DeleteMembershipUseCase) { }

  async execute(_input: void, id?: string): Promise<Membership | null> {
    if (!id) {
      throw new BadRequestError("No se proporcionó un id");
    }
    return await this.useCase.execute(id);
  }
}
