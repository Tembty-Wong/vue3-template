const { merge } = require('webpack-merge');
const portFinder = require('portfinder');

const serverConfig = require('./webpack.server');

module.exports = portFinder
  .getPortPromise({
    port: 8080,
  })
  .then((port) =>
    merge(serverConfig, {
      devServer: {
        port,
      },
    }),
  );
