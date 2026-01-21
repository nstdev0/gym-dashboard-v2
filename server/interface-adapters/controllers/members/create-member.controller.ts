import { CreateMemberUseCase } from "@/server/application/use-cases/members/create-member.use-case";

export class CreateMemberController {
  constructor(private readonly createMemberUseCase: CreateMemberUseCase) {}

  async execute(input: Record<string, unknown>) {
    return await this.createMemberUseCase.execute(input);
  }
}
