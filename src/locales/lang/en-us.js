import { importModuleGlob, importComponentGlob } from './helper';

let moduleMessages;

let componentMessages;

/**
 * 模块的国际化消息
 * @returns {object} 模块的国际化消息
 */
function createModuleMessages() {
  const modules = {};

  const moduleFiles = require.context('./en-us', true, /\.js$/);

  moduleFiles.keys().forEach((key, index) => {
    modules[`${key}`] = moduleFiles(key, index);
  });

  return importModuleGlob(modules, 'en-us');
}

/**
 * 组件的国际化消息
 * @returns {object} 组件的国际化消息
 */
function createComponentMessages() {
  const modules = {};

  const moduleFiles = require.context('@/components', true, /en-us.js$/);

  moduleFiles.keys().forEach((key, index) => {
    modules[`${key}`] = moduleFiles(key, index);
  });

  return importComponentGlob(modules);
}

if (import.meta.webpack) {
  componentMessages = createComponentMessages();

  moduleMessages = createModuleMessages();
} else {
  componentMessages = importComponentGlob(
    import.meta.glob('@/components/**/locales/en-us.js', { eager: true }),
  );

  moduleMessages = importModuleGlob(
    import.meta.glob('./en-us/**/*.js', { eager: true }),
    'en-us',
  );
}

export default {
  ...componentMessages,
  ...moduleMessages,
};
