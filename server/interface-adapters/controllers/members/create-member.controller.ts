import { CreateMemberSchema } from "@/server/application/dtos/members.dto";
import { ICreateMemberUseCase } from "@/server/application/use-cases/members/create-member.use-case";
import { ValidationError } from "@/server/domain/errors/common";

export class CreateMemberController {
  constructor(private readonly createMemberUseCase: ICreateMemberUseCase) {}

  async execute(input: unknown) {
    const validatedInput = CreateMemberSchema.safeParse(input);

    if (!validatedInput.success) {
      throw new ValidationError(
        "Datos inválidos",
        validatedInput.error.message,
      );
    }

    return await this.createMemberUseCase.execute(validatedInput.data);
  }
}
