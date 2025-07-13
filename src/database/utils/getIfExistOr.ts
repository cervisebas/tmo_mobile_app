export function getIfExistOr<T>(val: any, data: T, or: any): T {
  return val ? data : or;
}
