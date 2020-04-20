export const createEntitiesInstancesArray = <T>(EntityClass: new() => T, dataArray: Partial<T>[] = []): T[] => {
  const array: T[] = [];

  dataArray.forEach((data: T) => {
    const instance = new EntityClass();
    const object = Object.assign(instance, data);
    array.push(object);
  });

  return array;
};
