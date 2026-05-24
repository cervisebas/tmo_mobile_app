export function chunkArray<T>(
  arr: T[],
  size: number,
  fill: boolean = false,
): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    const chunk = arr.slice(i, i + size);

    if (fill && chunk.length < size) {
      // Rellenar con null hasta el tamaño
      const missing = size - chunk.length;
      chunk.push(...Array(missing).fill(null));
    }

    result.push(chunk);
  }

  return result;
}
