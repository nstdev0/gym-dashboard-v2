import { CreateMemberSchema } from "@/server/application/dtos/members.dto";
import { ICreateMemberUseCase } from "@/server/application/use-cases/members/create-member.use-case";
// Ya no necesitas importar ValidationError ni ZodError aquí

export class CreateMemberController {
  constructor(private readonly createMemberUseCase: ICreateMemberUseCase) { }

  async execute(input: unknown) {
    // Si la validación falla, esto lanza un "ZodError" automáticamente.
    // Api-handler lo atrapará y devolverá los errores detallados al frontend.
    const data = CreateMemberSchema.parse(input);

    return await this.createMemberUseCase.execute(data);
  }
}