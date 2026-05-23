export const runtime = "nodejs";

export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      sentry_dsn_configured: Boolean(process.env.SENTRY_DSN),
      ts: new Date().toISOString(),
    }),
    { headers: { "content-type": "application/json" } },
  );
}
