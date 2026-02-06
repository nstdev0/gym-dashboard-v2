import { IMembershipsRepository } from "@/server/application/repositories/memberships.repository.interface";
import { CreateMembershipInput } from "@/server/domain/types/memberships";
import { Membership } from "@/server/domain/entities/Membership";
import { ConflictError } from "@/server/domain/errors/common";

export interface ICreateMembershipUseCase {
  execute(input: CreateMembershipInput): Promise<Membership>;
}

export class CreateMembershipUseCase implements ICreateMembershipUseCase {
  constructor(private membershipsRepository: IMembershipsRepository) { }

  async execute(input: CreateMembershipInput): Promise<Membership> {
    // Check if member already has an active or pending membership
    const existingMembership = await this.membershipsRepository.findActiveMembershipByMemberId(
      input.memberId
    );

    if (existingMembership) {
      throw new ConflictError("El miembro ya tiene una membresía activa o pendiente");
    }

    return this.membershipsRepository.create(input);
  }
}
