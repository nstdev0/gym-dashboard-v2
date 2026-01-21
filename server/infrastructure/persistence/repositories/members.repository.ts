import { IMembersRepository } from "@repositories/members.repository.interface";
import { Member } from "@entities/Member";
import { prisma } from "../prisma";

export class MembersRepository implements IMembersRepository {
  async findAll(): Promise<Member[]> {
    return await prisma.member.findMany();
  }

  async create(input: Record<string, unknown>): Promise<Member> {
    return await prisma.member.create({ data: input });
  }
}
