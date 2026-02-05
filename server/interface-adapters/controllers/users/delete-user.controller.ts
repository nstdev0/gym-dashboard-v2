import { IDeleteUserUseCase } from "@/server/application/use-cases/users/delete-user.use-case";
import { auth } from "@clerk/nextjs/server";
import { ForbiddenError } from "@/server/domain/errors/common";
import { prisma } from "@/server/infrastructure/persistence/prisma";
import { Role } from "@/generated/prisma/client";

const ALLOWED_ROLES: Role[] = [Role.GOD, Role.OWNER];

export class DeleteUserController {
  constructor(private readonly useCase: IDeleteUserUseCase) { }

  async execute(id: string) {
    const session = await auth();

    if (!session.userId) {
      throw new ForbiddenError("No autenticado");
    }

    // 1. Prevent self-deletion
    if (session.userId === id) {
      throw new ForbiddenError("No puedes eliminar tu propia cuenta");
    }

    // 2. Check current user's role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role)) {
      throw new ForbiddenError("No tienes permisos para eliminar usuarios");
    }

    return await this.useCase.execute(id);
  }
}
