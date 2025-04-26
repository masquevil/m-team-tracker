export function isSizeLessThan30GB(size: string) {
  const gbSize = 1024 * 1024 * 1024 * 30;

  return parseInt(size) < gbSize;
}
