import { createI18n } from 'vue-i18n';
import zhCN from './lang/zh-cn';
import enUS from './lang/en-us';

// 预装默认语言
export const loadedLanguages = ['zh', 'en'];

/**
 * 初始化国际化
 */
export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  globalInjection: true,
  fallbackLocale: 'en',
  messages: {
    zh: zhCN,
    en: enUS,
  },
});

/**
 *
 * @param {string} locale - locale
 */
export function setI18nLanguage(locale) {
  i18n.global.locale.value = locale;

  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')?.setAttribute('lang', locale);
}

/**
 * 设置语言
 * @param {string} locale - locale
 * @returns {Promise} Promise
 */
export async function setLanguageAsync(locale) {
  // 如果语言相同
  if (i18n.global.locale.value === locale) {
    return Promise.resolve(setI18nLanguage(locale));
  }

  // 如果语言已经加载
  if (loadedLanguages.includes(locale)) {
    return Promise.resolve(setI18nLanguage(locale));
  }

  try {
    const message = await import(
      /* @vite-ignore */ /* webpackChunkName: "lang-[request]" */ `./lang/${locale}.js`
    );

    i18n.global.setLocaleMessage(locale, message.default);

    loadedLanguages.push(locale);

    return setI18nLanguage(locale);
  } catch (error) {
    return console.error(error);
  }
}

/**
 * 获取翻译字段
 * @param {string} text - text
 * @returns {string} text
 */
export function getTranslate(text) {
  return i18n.global.t(text);
}

/**
 * 获取当前语言
 * @returns {string} locale
 */
export function getLanguage() {
  return i18n.global.locale.value;
}

/**
 * 挂载国际化
 * @param {object} app - App
 * @returns {object} i18n
 */
export function setupI18n(app) {
  app.use(i18n);

  return i18n;
}
