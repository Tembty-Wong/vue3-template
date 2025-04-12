import { importModuleGlob, importComponentGlob } from './helper';

let moduleMessages;

let componentMessages;

/**
 * 模块的国际化消息
 * @returns {object} 模块的国际化消息
 */
function createModuleMessages() {
  const modules = {};

  const moduleFiles = require.context('./zh-cn', true, /\.js$/);

  moduleFiles.keys().forEach((key, index) => {
    modules[`${key}`] = moduleFiles(key, index);
  });

  return importModuleGlob(modules, 'zh-cn');
}

/**
 * 组件的国际化消息
 * @returns {object} 组件的国际化消息
 */
function createComponentMessages() {
  const modules = {};

  const moduleFiles = require.context('@/components', true, /zh-cn.js$/);

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
    import.meta.glob('@/components/**/locales/zh-cn.js', { eager: true }),
  );

  moduleMessages = importModuleGlob(
    import.meta.glob('./zh-cn/**/*.js', { eager: true }),
    'zh-cn',
  );
}

export default {
  ...componentMessages,
  ...moduleMessages,
};
