import { CreateMemberUseCase } from "@/server/application/use-cases/members/create-member.use-case";
import { GetAllMembersUseCase } from "@/server/application/use-cases/members/get-all-members.use-case";
import { MembersRepository } from "@/server/infrastructure/persistence/repositories/members.repository";
import { CreateMemberController } from "@/server/interface-adapters/controllers/members/create-member.controller";
import { GetAllMembersController } from "@interface-adapters/controllers/members/get-all-members.controller";
import { NextRequest } from "next/server";

// Repositories
const membersRepo = new MembersRepository();

// Use Cases
const getAllMembersUseCase = new GetAllMembersUseCase(membersRepo);
const createMemberUseCase = new CreateMemberUseCase(membersRepo);

// Controllers
const getAllMembersController = new GetAllMembersController(
  getAllMembersUseCase,
);
const createMemberController = new CreateMemberController(createMemberUseCase);

export const GET = async () => {
  const members = await getAllMembersController.execute();
  return Response.json(members);
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const member = await createMemberController.execute(data);
  return Response.json(member);
};
