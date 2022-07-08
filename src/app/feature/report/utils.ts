export const groupBy = (key: string | number, prop: any) => (array: any[]) =>
  array.reduce(
    (objectsByKeyValue: any, obj: any) => ({
      ...objectsByKeyValue,
      [obj[prop][key]]: (objectsByKeyValue[obj[prop][key]] || []).concat(obj),
    }),
    {}
  );

export const filterWith =
  (filterArr: any[], filterProp: string) => (array: any[]) =>
    array.filter((el) => {
      return filterArr.some((f) => {
        return f[filterProp] === el[filterProp];
      });
    });

export const getId = (array: any[], prop: string) =>
  array && array.length > 0 && array[0] ? array[0][prop] : '';

export const isArrayDefinedWithValue = (array: any[]) => array && array[0];

export const isArrayDefinedWithNull = (array: any[]) =>
  array && array[0] === null;
