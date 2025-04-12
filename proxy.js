const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const httpsRE = /^https:\/\//;

const app = express();

const domain = {
  dev: 'https://ibs-dev.midea.com',
  sit: 'https://ibs-sit.midea.com',
  uat: 'https://ibs-uat.midea.com',
  prd: 'https://ibs-hk.midea.com',
};

const proxyTable = {
  '/': {
    target: domain.sit,
  },
};

Object.entries(proxyTable).forEach(([context, options]) => {
  const isHttps = httpsRE.test(options.target);

  app.use(
    createProxyMiddleware(context, {
      ...options,
      changeOrigin: true,
      ws: true,
      onProxyReq: (proxyReq) => {
        // proxyReq.setHeader('mas_remote_user', 'huangtb');
      },
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }),
  );
});

app.listen(3030);
