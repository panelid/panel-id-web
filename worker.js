export default {
  async fetch(request, env) {
    // Serve static assets; fallback to index.html for any path
    const url = new URL(request.url);
    let resp = await env.ASSETS.fetch(request);
    if (resp.status === 404) {
      resp = await env.ASSETS.fetch(new Request(url.origin + "/index.html", request));
    }
    return resp;
  },
};
