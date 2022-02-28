export async function sleepSeconds(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, (seconds * 1000)));
}

// extract this and the one in app to core
export function currentTimeSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
