

export function fatalShutdown(
  reason: string,
  options?: { title?: string; exitCode?: number }
): never {
  console.error(`❌ ${options?.title ?? "FATAL ERROR"}`);
  console.error(reason);
  console.error("Server failed to start\n");

  process.exit(options?.exitCode ?? 1);
}
