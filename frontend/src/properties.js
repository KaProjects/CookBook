/**
 * The backend is reached through a same-origin /api prefix: nginx proxies it in production
 * (deploy/nginx.conf) and setupProxy.js in development, so no host or port is baked into the
 * bundle.
 */
export const backend = "/api"

export const properties = {
    backend: backend,
}
