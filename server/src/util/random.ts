import crypto from 'crypto';

const codeAlphabet = "BCDFGHJKLMNPQRSTUVWXYZ2456789";

export function randomCode(length: number, mode: 'cryptographic' | 'insecure'): string {
  const chars: string[] = [];
  for (let i = 0; i < length; i++) {
    const digitIndex = mode === 'cryptographic'
      ? crypto.randomInt(0, codeAlphabet.length - 1)
      : Math.floor(codeAlphabet.length * Math.random());
    chars.push(codeAlphabet[digitIndex]);
  }
  return chars.join('');
}
