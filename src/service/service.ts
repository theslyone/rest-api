export interface IService<T> {
  create(data: T): Promise<T>
  update(id: string, data: T): Promise<T>
  delete(id: string): Promise<T>
  getAll(condition?: Record<string, unknown>, sort?: Record<string, unknown>): Promise<Array<T>>
  getById(id: string): Promise<T>
}