module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.34',
        loose: true,
      },
    ],
  ],
  plugins: [
    ['@vue/babel-plugin-jsx'],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        helpers: true,
        useESModules: false,
      },
    ],
  ],
  comments: false,
};
