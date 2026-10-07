import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createSandbox } from "../../../packages/core/src/sandbox.js";
import { createResource } from "../../../packages/core/src/resource.js";

const PORT = Number(process.env.PORT ?? 3000);
const OWNER_ID = "local-user";
const sandboxes = new Map<string, ReturnType<typeof createSandbox>>();
const resources = new Map<
  string,
  ReturnType<typeof createResource>
>();

function json(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(JSON.stringify(body));
}

async function body(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  const path = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`).pathname;

  if (method === "OPTIONS") return json(res, 204, {});
  if (method === "GET" && path === "/health") return json(res, 200, { ok: true, service: "blank-box-api" });
  if (method === "GET" && path === "/sandboxes") return json(res, 200, { sandboxes: [...sandboxes.values()].map(x => x.sandbox) });

  if (method === "POST" && path === "/sandboxes") {
    try {
      const input = await body(req);
      const result = createSandbox({
        ownerId: OWNER_ID,
        name: typeof input.name === "string" ? input.name : "",
        description: typeof input.description === "string" ? input.description : undefined
      });
      sandboxes.set(result.sandbox.id, result);
      return json(res, 201, { sandbox: result.sandbox, membership: result.ownerMembership });
    } catch (error) {
      return json(res, 400, { error: error instanceof Error ? error.message : "Invalid request" });
    }
  }
if (method === "GET" && path === "/resources") {
  return json(res, 200, {
    resources: [...resources.values()],
  });
}
if (method === "POST" && path === "/resources") {
  try {
    const input = await body(req);

    const resource = createResource({
      sandboxId:
        typeof input.sandboxId === "string"
          ? input.sandboxId
          : "",
      ownerId: OWNER_ID,
      title:
        typeof input.title === "string"
          ? input.title
          : "",
      type:
        typeof input.type === "string"
          ? input.type as Parameters<typeof createResource>[0]["type"]
          : "custom",
      description:
        typeof input.description === "string"
          ? input.description
          : undefined,
      visibility:
        typeof input.visibility === "string"
          ? input.visibility as Parameters<typeof createResource>[0]["visibility"]
          : undefined,
    });

    resources.set(resource.id, resource);

    return json(res, 201, { resource });
  } catch (error) {
    return json(res, 400, {
      error:
        error instanceof Error
          ? error.message
          : "Invalid request",
    });
  }
}
  return json(res, 404, { error: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Blank Box API listening on http://localhost:${PORT}`));
