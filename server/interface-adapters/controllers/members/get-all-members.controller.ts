import { GetAllMembersUseCase } from "@/server/application/use-cases/members/get-all-members.use-case";

export class GetAllMembersController {
  constructor(private readonly getAllMembersUseCase: GetAllMembersUseCase) {}

  async execute() {
    return await this.getAllMembersUseCase.execute();
  }
}
