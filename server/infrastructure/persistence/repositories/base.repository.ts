import { IBaseRepository } from "@repositories/base.repository.interface";

export class BaseRepository<T> implements IBaseRepository<T> {
  findAll(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  create(input: Record<string, unknown>): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
