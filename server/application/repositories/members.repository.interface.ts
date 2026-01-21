import { Member } from "@entities/Member";
import { IBaseRepository } from "./base.repository.interface";

export interface IMembersRepository extends IBaseRepository<Member> {}
