import { CreateMemberSchema } from "@/server/application/dtos/create-member.dto";
import { ValidationError } from "@/server/domain/errors/common";
import { ICreateMemberUseCase } from "@use-cases/members/create-member.use-case";
import { NextRequest } from "next/server";

export class CreateMemberController {
  constructor(private readonly createMemberUseCase: ICreateMemberUseCase) {}

  async execute(input: NextRequest | undefined) {
    try {
      const validatedInput = CreateMemberSchema.safeParse(
        await (input as NextRequest).json(),
      );

      if (!validatedInput.success) {
        throw new ValidationError(
          "Datos inválidos",
          validatedInput.error.errors,
        );
      }

      return await this.createMemberUseCase.execute(validatedInput.data);
    } catch (error) {
      throw error;
    }
  }
}
