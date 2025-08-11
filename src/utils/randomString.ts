export function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const max = chars.length;
  const arr = Array.from({ length: length }, () => chars[Math.floor(Math.random() * max)]);
  return arr.join('');
}
