import { DocType, Gender } from "../entities/Member";

export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  gender?: Gender;
  birthDate?: Date;
  email?: string;
  phone: string;
  docType: DocType;
  docNumber: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  isActive?: boolean;
}
