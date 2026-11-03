const { createProxyMiddleware } = require("http-proxy-middleware");

const backendPort = process.env.REACT_APP_BACKEND_PORT || "9090";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${backendPort}`,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
