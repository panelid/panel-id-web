// Serve static assets from KV (wrangler [site] bucket)
// Falls back to index.html for any path (SPA-style)
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest }
      );
    } catch {
      // Any path → index.html
      return await getAssetFromKV(
        {
          request: new Request(new URL("/index.html", request.url), request),
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest }
      );
    }
  },
};
