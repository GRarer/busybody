import crypto from 'crypto';

export function randomCode(length: number, mode: "cryptographic" | "insecure"): string {
  const maximum = Math.floor((10**length)-1);
  const codeNumber = mode === "cryptographic"
    ? crypto.randomInt(1, maximum)
    : Math.ceil(maximum * Math.random());
  const codeDigits = `${codeNumber}`;
  return "0".repeat(length - codeDigits.length) + codeDigits;
}
