import { BaseEntity } from "./_base";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum DocType {
  DNI = "DNI",
  CE = "CE",
  PASSPORT = "PASSPORT",
}

export class Member extends BaseEntity {
  constructor(
    id: string,
    organizationId: string,
    createdAt: Date,
    updatedAt: Date,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public docType: DocType,
    public docNumber: string,
    public isActive: boolean,
    public birthDate?: Date,
    public gender?: Gender,
  ) {
    super(id, organizationId, createdAt, updatedAt);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
