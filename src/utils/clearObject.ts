export function clearObject<T extends object>(obj: T): T {
  const new_obj: any = {};

  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined && val !== null) {
      Object.assign(new_obj, {
        [key]: val,
      });
    }
  }

  return new_obj;
}