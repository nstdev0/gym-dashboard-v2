// Probando refactorizacion para dejar de usar controllers y pasar a usar server actions directamente.

import { cache } from "react";
import { MembersRepository } from "@persistence/repositories/members.repository";
import { GetAllMembersUseCase } from "@use-cases/members/get-all-members.use-case";
import { CreateMemberUseCase } from "@use-cases/members/create-member.use-case";
import { GetAllMembersController } from "@controllers/members/get-all-members.controller";
import { CreateMemberController } from "@controllers/members/create-member.controller";
import { prisma } from "../infrastructure/persistence/prisma";
import { CreateOrganizationsController } from "../interface-adapters/controllers/organizations/create-organization.controller";
import { OrganizationsRepository } from "../infrastructure/persistence/repositories/organizations.repository";
import { CreateOrganizationUseCase } from "../application/use-cases/organizations/create-organization.use-case";
import { GetAllOrganizationsUseCase } from "../application/use-cases/organizations/get-all-organizations.use-case";
import { GetAllOrganizationsController } from "../interface-adapters/controllers/organizations/get-all-organizations.controller";
import { auth } from "@clerk/nextjs/server";

// Factory function "memoizada" por request
export const getContainer = cache(async () => {
  const { orgId } = await auth(); // Clerk cachea esto, no es doble llamada lenta

  // Si llegamos aquí, el middleware ya validó que orgId existe.
  // Pero por seguridad de tipos, podemos hacer un fallback o cast.
  const tenantId = orgId as string;

  // Repositories
  const organizationsRepository = new OrganizationsRepository(
    prisma.organization,
    tenantId,
  );
  const membersRepository = new MembersRepository(prisma.member, tenantId);

  // Use Cases

  // Organizations
  const getAllOrganizationsUseCase = new GetAllOrganizationsUseCase(
    organizationsRepository,
  );
  const createOrganizationUseCase = new CreateOrganizationUseCase(
    organizationsRepository,
  );

  // Members
  const getAllMembersUseCase = new GetAllMembersUseCase(membersRepository);
  const createMemberUseCase = new CreateMemberUseCase(membersRepository);

  // Controllers

  // Organizations
  const getAllOrganizationsController = new GetAllOrganizationsController(
    getAllOrganizationsUseCase,
  );
  const createOrganizationController = new CreateOrganizationsController(
    createOrganizationUseCase,
  );

  // Members
  const getAllMembersController = new GetAllMembersController(
    getAllMembersUseCase,
  );
  const createMemberController = new CreateMemberController(
    createMemberUseCase,
  );

  return {
    getAllOrganizationsController,
    createOrganizationController,
    getAllMembersController,
    createMemberController,
  };
});
