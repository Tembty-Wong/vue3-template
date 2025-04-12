const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const DotenvPlugin = require('dotenv-webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UnusedPlugin = require('unused-webpack-plugin');

const join = (dir) => {
  return path.join(__dirname, dir);
};

// const resolve = (dir) => {
//   return path.resolve(__dirname, dir);
// };

const PUBLIC_PATH = join('public');
const APP_PATH = join('src');
const BUILD_PATH = join('dist');

const { parsed: env } = dotenv.config({
  path: `.env.${process.env.BUILD_ENV}`,
});

const publicPath = env?.VITE_PUBLIC_PATH ?? '/';

const config = {
  entry: {
    index: join('src/main.js'),
  },
  output: {
    path: BUILD_PATH,
    publicPath,
    crossOriginLoading: 'use-credentials',
    filename: 'assets/js/[name].min.js?v=[contenthash]',
    chunkFilename: 'assets/js/[name].min.js?v=[contenthash]',
    assetModuleFilename: 'assets/images/[name].[contenthash][ext]',
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.x?html?$/,
        include: [/src/],
        exclude: [/node_modules/],
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.mjs$/i,
        resolve: {
          byDependency: {
            esm: {
              fullySpecified: false,
            },
          },
        },
      },
      {
        test: /\.m?jsx?$/,
        include: [/src/, /submodule/],
        exclude: [/node_modules/],
        use: [
          {
            loader: 'thread-loader',
          },
          {
            loader: 'swc-loader',
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader:
              process.env.NODE_ENV === 'development'
                ? 'style-loader'
                : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@use "@/_variable.scss";`,
              sassOptions: {
                outputStyle: 'compressed',
              },
              sourceMap: process.env.NODE_ENV === 'development',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/inline',
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'thread-loader',
          },
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                isCustomElement: (tag) => /^micro-app/.test(tag),
              },
            },
          },
        ],
      },
    ]
  },
  resolve: {
    alias: {
      '@': APP_PATH,
    },
    extensions: ['.vue', '.jsx', '.js', '.mjs', '.scss'],
    modules: ['node_modules'],
  },
  plugins: [
    new DotenvPlugin({
      path: `.env.${process.env.BUILD_ENV}`,
      prefix: 'import.meta.env.',
    }),
    new VueLoaderPlugin(),
    // new ESLintPlugin({
    //   cache: true,
    //   context: APP_PATH,
    //   extensions: ['mjs', 'js', 'jsx', 'vue'],
    //   failOnWarning: true,
    //   fix: true,
    //   threads: true,
    // }),
    // new StylelintPlugin({
    //   cache: true,
    //   context: APP_PATH,
    //   files: ['**/*.(s(c|a)ss|css|vue)'],
    //   fix: true,
    //   threads: true,
    // }),
    new HtmlPlugin({
      filename: 'index.html',
      template: `${APP_PATH}/index.html`,
      inject: 'body',
      favicon: 'public/favicon.ico',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        minifyCSS: true,
      },
      chunks: ['vendors', 'commons', 'index'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: PUBLIC_PATH,
          to: BUILD_PATH,
        },
        {
          from: `${APP_PATH}/assets`,
          to: `${BUILD_PATH}/assets`,
        },
      ],
    }),
  ],
};


if (process.env.USE_ANALYZE) {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 'auto',
    }),
  );
}

if (process.env.USE_MEASURE) {
  config.plugins.push(
    new webpack.debug.ProfilingPlugin({
      outputPath: join('report/profile.json'),
    }),
  );
}

if (process.env.USE_UNUSED) {
  config.plugins.push(
    new UnusedPlugin({
      // Source directories
      directories: [join('src')],
      // Exclude patterns
      exclude: ['*.test.js'],
      // Root directory (optional)
      root: __dirname,
    }),
  );
}

module.exports = config;

