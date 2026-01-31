import { Member } from "@/server/domain/entities/Member";
import { IMembersRepository } from "../../repositories/members.repository.interface";
import { CreateMemberInput } from "../../dtos/members.dto";
import { ConflictError } from "@/server/domain/errors/common";

export class CreateMemberUseCase {
  constructor(private readonly membersRepo: IMembersRepository) {}

  async execute(input: CreateMemberInput): Promise<Member> {
    // Validaciones de negocio (Email y DNI únicos)
    const errors: string[] = [];

    const validateUnique = await this.membersRepo.validateUnique(input);

    if (validateUnique) errors.push("Email or Document number already exists");

    if (errors.length > 0) {
      const msg = errors.join(" and ");
      throw new ConflictError(`${msg}`);
    }

    return await this.membersRepo.create(input);
  }
}

export type ICreateMemberUseCase = InstanceType<typeof CreateMemberUseCase>;
