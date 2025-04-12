import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './routers';
import { setupStore } from './stores';
import { setupI18n } from './locales';

import './global.scss';

/**
 * 初始化
 */
async function bootstrap() {

  const app = createApp(App);

  // 注册路由
  const router = await setupRouter(app);

  await router.isReady();

  // 注册状态管理器
  setupStore(app);

  // 注册国际化
  setupI18n(app);


  app.mount('#app');
}

bootstrap();