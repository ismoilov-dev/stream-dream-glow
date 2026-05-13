import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = "http://16.170.235.75";

const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "content-encoding",
  "accept-encoding",
]);

async function forward(request: Request, splat: string) {
  const inUrl = new URL(request.url);
  const target = `${UPSTREAM}/${splat}${inUrl.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
  });
  // Some upstreams reject unknown hosts — strip and let fetch set it.
  headers.delete("host");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    return new Response(
      JSON.stringify({ detail: "Upstream unreachable", error: String(err) }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  const respHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) respHeaders.set(key, value);
  });
  // Avoid stale CDN caching of API responses
  respHeaders.set("cache-control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}

export const Route = createFileRoute("/api/proxy/$")({
  server: {
    handlers: {
      GET: ({ request, params }) => forward(request, params._splat ?? ""),
      POST: ({ request, params }) => forward(request, params._splat ?? ""),
      PUT: ({ request, params }) => forward(request, params._splat ?? ""),
      PATCH: ({ request, params }) => forward(request, params._splat ?? ""),
      DELETE: ({ request, params }) => forward(request, params._splat ?? ""),
      OPTIONS: ({ request, params }) => forward(request, params._splat ?? ""),
    },
  },
});
