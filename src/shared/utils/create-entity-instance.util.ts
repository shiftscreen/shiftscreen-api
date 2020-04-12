export const createEntityInstance = <T>(EntityClass: new() => T, data: Partial<T>): T => {
  const instance = new EntityClass();
  return Object.assign(instance, data);
};
