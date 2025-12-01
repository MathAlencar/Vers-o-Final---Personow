// /app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server"; // ⬅️ Importe NextRequest

// Definição do tipo para o contexto da rota
interface RouteContext {
  params: {
    path: string[];
  };
}

export async function GET(
  req: NextRequest, // ⬅️ Use NextRequest
  context: RouteContext,
) {
  return proxyRequest(req, context.params);
}

export async function POST(
  req: NextRequest, // ⬅️ Use NextRequest
  context: RouteContext,
) {
  return proxyRequest(req, context.params);
}

export async function PUT(
  req: NextRequest, // ⬅️ Use NextRequest
  context: RouteContext,
) {
  return proxyRequest(req, context.params);
}

export async function DELETE(
  req: NextRequest, // ⬅️ Use NextRequest
  context: RouteContext,
) {
  return proxyRequest(req, context.params);
}

export async function PATCH(
  req: NextRequest, // ⬅️ Use NextRequest
  context: RouteContext,
) {
  return proxyRequest(req, context.params);
}

// ----------------------------------------------------------------------
// Função de Proxy
// ----------------------------------------------------------------------

// Altere o tipo do primeiro argumento para NextRequest
async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  // A lógica de extrair a query string do NextRequest é mais simples
  const endpoint = params.path?.join("/") ?? "";
  const search = req.nextUrl.search; // ⬅️ Use req.nextUrl.search para query params

  const backendURL =
    "http://34.39.211.212:3018/" + endpoint + (search ? `${search}` : ""); // O search já inclui '?' se houver parâmetros

  const method = req.method;
  const body =
    method !== "GET" && method !== "HEAD" ? await req.text() : undefined;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length"); // Recomendado remover Content-Length para evitar problemas com fetch

  const response = await fetch(backendURL, {
    method,
    headers,
    body,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const status = response.status;

  // Se o Next.js não gostar do corpo da resposta, ele pode corromper
  // Tente simplificar a resposta, garantindo que o status e os headers sejam repassados.
  if (contentType.includes("application/json")) {
    const data = await response.json();
    return NextResponse.json(data, {
      status,
      headers: Object.fromEntries(response.headers.entries()),
    });
  }

  // Retorna a resposta RAW para outros tipos (HTML, texto, etc.)
  return new Response(await response.text(), {
    status,
    headers: Object.fromEntries(response.headers.entries()),
  });
}
