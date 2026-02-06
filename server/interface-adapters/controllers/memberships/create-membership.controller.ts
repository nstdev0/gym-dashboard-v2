import { CreateMembershipInput } from "@/server/application/dtos/memberships.dto";
import { ICreateMembershipUseCase } from "@/server/application/use-cases/memberships/create-membership.use-case";
import { Membership } from "@/server/domain/entities/Membership";
import { ControllerExecutor } from "@/server/lib/api-handler";

export class CreateMembershipController implements ControllerExecutor<CreateMembershipInput, Membership> {
  constructor(private readonly useCase: ICreateMembershipUseCase) { }

  async execute(input: CreateMembershipInput): Promise<Membership> {
    return await this.useCase.execute(input);
  }
}
