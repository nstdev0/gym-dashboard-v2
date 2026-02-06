import { UpdateUserSchema } from "@/server/application/dtos/users.dto";
import { IUpdateUserUseCase } from "@/server/application/use-cases/users/update-user.use-case";
import { ValidationError, ForbiddenError } from "@/server/domain/errors/common";
import { UpdateUserInput } from "@/server/domain/types/users";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/infrastructure/persistence/prisma";
import { Role } from "@/generated/prisma/client";

const ALLOWED_ROLES: Role[] = [Role.GOD, Role.OWNER];

export class UpdateUserController {
  constructor(private readonly useCase: IUpdateUserUseCase) { }

  async execute(input: UpdateUserInput, id: string) {
    const validatedInput = UpdateUserSchema.safeParse(input);

    if (!validatedInput.success) {
      throw new ValidationError(
        "Datos inválidos",
        validatedInput.error.message,
      );
    }

    const session = await auth();

    if (!session.userId) {
      throw new ForbiddenError("No autenticado");
    }

    // Check current user's role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role)) {
      throw new ForbiddenError("No tienes permisos para actualizar usuarios");
    }

    return await this.useCase.execute(
      validatedInput.data,
      id,
    );
  }
}
