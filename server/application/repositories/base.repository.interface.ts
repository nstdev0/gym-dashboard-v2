export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  create(input: Record<string, unknown>): Promise<T>;
}
