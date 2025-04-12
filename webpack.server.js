const fs = require('fs');
const path = require('path');
const { merge } = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const webpackBaseConfig = require('./webpack.base');

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  context: __dirname,
  devServer: {
    allowedHosts: ['.midea.com'],
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
      progress: true,
    },
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    host: 'local.midea.com',
    hot: true,
    open: true,
    server: 'https',
    // proxy: {
    //   '/': {
    //     router: () => {
    //       const data = fs.readFileSync(
    //         path.join(__dirname, 'proxy.js'),
    //         'utf8',
    //       );
    //       const [, port] = data.match(/app.listen\((\S*)\);/);
    //       return {
    //         protocol: 'http:',
    //         host: 'local.midea.com',
    //         port,
    //       };
    //     },
    //     bypass: (req) => {
    //       if (req.headers.accept.indexOf('html') !== -1) {
    //         return process.env.VITE_PUBLIC_PATH + 'index.html';
    //       }
    //     },
    //   },
    // },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  plugins: [new FriendlyErrorsPlugin()],
  stats: 'errors-only',
  target: 'web',
});
