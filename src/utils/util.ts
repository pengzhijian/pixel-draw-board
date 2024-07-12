/**
 * 深拷贝对象
 */
export function deepCopy<T>(obj: T): T {
  // 基本类型直接返回
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
      const arrCopy = [] as any[];
      for (const item of obj) {
          arrCopy.push(deepCopy(item));
      }
      return arrCopy as unknown as T;
  }

  // 处理对象
  const objCopy = {} as { [key: string]: any };
  for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          objCopy[key] = deepCopy(obj[key]);
      }
  }
  return objCopy as T;
}