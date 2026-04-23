export const matchPath = (pattern, pathname) => {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    if (patternPart.startsWith(':')) {
      const key = patternPart.slice(1);
      params[key] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  return params;
};

export const createRouter = (routes) => async (req, res) => {
  const host = req.headers.host || 'localhost';
  const url = new URL(req.url || '/', `http://${host}`);
  req.context = { url };

  for (const route of routes) {
    if (route.method && route.method !== req.method) continue;
    const params = matchPath(route.path, url.pathname);
    if (!params) continue;

    req.context.params = params;

    if (route.middlewares) {
      for (const middleware of route.middlewares) {
        const ok = await middleware(req, res);
        if (ok === false || res.writableEnded) return true;
      }
    }

    await route.handler(req, res);
    return true;
  }

  return false;
};
