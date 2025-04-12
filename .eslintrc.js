module.exports = {
  parserOptions: {
    babelOptions: {
      configFile: './.babelrc.js',
    },
  },
  extends: [
    '@tembty/eslint-config/vue3',
    /** ==== @vue/eslint-config-prettier ==== */
    '@vue/eslint-config-prettier',
    // Turn on prettier rules
    /** ==== eslint-config-prettier ==== */
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-underscore-dangle': 'off',
    'max-lines-per-function': 'off',
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias: {
          // '~': 'submodule/packages',
        },
      },
    },
  },
};
