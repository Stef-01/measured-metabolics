// Vitest stub for Next.js's `server-only` virtual module.
// Real `server-only` throws at import-time inside client bundles to enforce
// that a module is server-only. In Vitest there is no client/server split,
// so we make it a no-op.
export {};
