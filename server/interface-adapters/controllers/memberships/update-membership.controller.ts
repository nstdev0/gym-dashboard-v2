import { UpdateMembershipInput } from "@/server/application/dtos/memberships.dto";
import { UpdateMembershipUseCase } from "@/server/application/use-cases/memberships/update-membership.use-case";
import { Membership } from "@/server/domain/entities/Membership";
import { BadRequestError } from "@/server/domain/errors/common";
import { ControllerExecutor } from "@/server/lib/api-handler";

export class UpdateMembershipController implements ControllerExecutor<UpdateMembershipInput, Membership | null> {
  constructor(private readonly useCase: UpdateMembershipUseCase) { }

  async execute(input: UpdateMembershipInput, id?: string): Promise<Membership | null> {
    if (!id) {
      throw new BadRequestError("No se proporcionó un id");
    }
    return await this.useCase.execute(id, input);
  }
}
