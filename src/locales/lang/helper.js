import { set } from 'lodash-es';

/**
 * 导入模块国际化
 * @param {Array} modules - 模块对象
 * @param {string} prefix - 前缀
 * @returns {object} messages - 导入的模块对象
 */
export function importModuleGlob(modules, prefix = 'lang') {
  const messages = {};

  Object.keys(modules).forEach((key) => {
    const langFileModule = modules[`${key}`].default;

    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');

    const lastIndex = fileName.lastIndexOf('.');

    fileName = fileName.substring(0, lastIndex);

    const keyList = fileName.split('/');

    const moduleName = keyList.shift();

    const objKey = keyList.join('.');

    if (moduleName) {
      if (objKey) {
        set(messages, moduleName, messages[`${moduleName}`] || {});
        set(messages[`${moduleName}`], objKey, langFileModule);
      } else {
        set(messages, moduleName, langFileModule || {});
      }
    }
  });

  return messages;
}

/**
 * 导入组件模块国际化
 * @param {object} modules - 组件模块对象
 * @returns {object} - 导入的组件模块对象
 */
export function importComponentGlob(modules) {
  let messages = {};

  Object.keys(modules).forEach((key) => {
    const langFileModule = modules[`${key}`].default;

    if (langFileModule) {
      messages = { ...messages, ...langFileModule };
    }
  });

  return messages;
}
