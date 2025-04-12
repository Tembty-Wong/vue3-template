const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const webpackBaseConfig = require('./webpack.base');

module.exports = (dirname) => {
  return merge(webpackBaseConfig(dirname), {
    mode: 'production',
    output: {
      clean: true,
    },
    plugins: [
      new webpack.ids.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: 'assets/css/[name].min.css?v=[contenthash]',
        chunkFilename: 'assets/css/[name].min.css?v=[contenthash]',
      }),
      new CompressionPlugin({
        minRatio: 0.8,
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          exclude: /\.min\.js$/,
          minify: TerserPlugin.esbuildMinify,
          parallel: true,
          extractComments: false,
          terserOptions: {
            drop:
              process.env.BUILD_ENV === 'dev' ? [] : ['console', 'debugger'],
          },
        }),
        new CssMinimizerPlugin({
          test: /\.css$/g,
          parallel: true,
          minimizerOptions: {
            preset: [
              'advanced',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // mdesign: {
          //   test: /[\\/]node_modules[\\/](mdesign3|@mdesign3\/icons-vue)[\\/]/,
          //   priority: 20,
          //   name: 'mdesign',
          // },
          // itsm: {
          //   test: /[\\/]node_modules[\\/](itsm-feedback-v3)[\\/]/,
          //   priority: 15,
          //   name: 'itsm',
          // },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            name: 'vendors',
            chunks: 'initial', // only package third parties that are initially dependent
          },
          commons: {
            minChunks: 2,
            priority: 5,
            name: 'commons',
            reuseExistingChunk: true,
          },
        },
      },
    },
  });
};
