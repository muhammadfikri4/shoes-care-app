export function bytesToMB(bytesSize: number) {
    const mb = bytesSize / (1024 * 1024);
  return Math.round(mb * 100) / 100;
}
