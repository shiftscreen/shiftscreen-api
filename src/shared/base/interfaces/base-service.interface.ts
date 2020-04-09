export interface IBaseService<T> {
  findAll(): Promise<T[]>;
  findOneById(id: string | number): Promise<T>;
  updateOne(id: string | number, entity: any): Promise<T>;
  findOneByConditions(conditions: any): Promise<T>;
  create(entity: any): Promise<T>;
  deleteOne(id: string | number);
}
