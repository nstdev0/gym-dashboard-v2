import { UpdateMemberInput } from "@/server/domain/types/members";
import { IMembersRepository } from "@/server/application/repositories/members.repository.interface";
import { Member } from "@/server/domain/entities/Member";
import { IMCCalculator } from "@/server/application/services/imc-calculator.service";
import { ConflictError } from "@/server/domain/errors/common";

export class UpdateMemberUseCase {
  constructor(private readonly repository: IMembersRepository) { }

  async execute(id: string, data: UpdateMemberInput): Promise<Member> {
    // Only validate email uniqueness for updates (docType/docNumber are immutable)
    if (data.email) {
      const existingWithEmail = await this.repository.validateUnique({
        email: data.email,
      });

      // If found and it's not the same member, it's a conflict
      if (existingWithEmail && existingWithEmail.id !== id) {
        throw new ConflictError("Email already exists");
      }
    }

    // 1. Fetch current member to get missing height/weight if needed
    const currentMember = await this.repository.findUnique({ id });

    if (currentMember) {
      const newHeight = data.height ?? currentMember.height;
      const newWeight = data.weight ?? currentMember.weight;

      if (newHeight && newWeight) {
        const imc = IMCCalculator.calculate(newWeight, newHeight);
        if (imc) {
          data.imc = imc;
        }
      }
    }

    return await this.repository.update(id, data);
  }
}

export type IUpdateMemberUseCase = InstanceType<typeof UpdateMemberUseCase>;