import { createRouter, createWebHistory } from 'vue-router';
import { useTitle } from '@vueuse/core';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// import { isURL } from '@midea/itp-utils';
// import { usePortalStorage } from '~/composables';
// import Layout from '@/views/layout/index.vue';
// import AppCenter from '@/views/app-center/index.vue';
import noAsideRouteModules from './no-aside';
import NotFound from '@/views/not-found/index.vue';

const routeModules = [];

const PUBLIC_PATH = '';

const requireModules = (module) => {
  if (module) {
    routeModules.push(...(Array.isArray(module) ? [...module] : [module]));
  }
};

if (import.meta.webpack) {
  const modules = require.context('./modules', true, /\.js$/);

  modules.keys().forEach((key) => {
    const module = modules(key).default;

    requireModules(module);
  });
} else {
  const modules = import.meta.glob('./modules/**/*.js', { eager: true });

  Object.keys(modules).forEach((key) => {
    const module = modules[`${key}`].default;

    requireModules(module);
  });
}

/**
 * 挂载路由
 * @param {object} app - vue 实例
 * @param {Array} apps - 子应用集合
 * @returns {object} router
 */
export async function setupRouter(app, apps) {
  // const { iscApp } = usePortalStorage();

  // 动态子应用路由
  // const microRouteModules = apps.map(
  //   ({ title, code, accessFlag, defaultFlag, application }) => {
  //     const base = code;

  //     const mainBaseRoute = PUBLIC_PATH + base;

  //     const meta = {
  //       title,
  //       code,
  //       accessFlag,
  //       defaultFlag,
  //     };

  //     return {
  //       path: `/${base}`,
  //       name: code,
  //       component: NotFound,
  //       props: {
  //         items: apps,
  //       },
  //       meta,
  //       // children: [
  //       //   {
  //       //     path: `/${base}/home`,
  //       //     name: `${code}_home`,
  //       //     local_name: '首页',
  //       //     component: () => import('@/views/home/index.vue'),
  //       //     meta: {
  //       //       ...meta,
  //       //       icon: 'icon-gongzuotai',
  //       //       static: true,
  //       //       affix: true,
  //       //     },
  //       //   },
  //       //   {
  //       //     path: `/${base}/todo`,
  //       //     name: `${base}_todo`,
  //       //     local_name: '待办',
  //       //     component: () => import('@/views/todo/index.vue'),
  //       //     meta: {
  //       //       ...meta,
  //       //       hidden: true,
  //       //     },
  //       //   },
  //       //   {
  //       //     path: `/${base}/downloads`,
  //       //     name: `${base}_downloads`,
  //       //     local_name: '下载中心',
  //       //     component: () => import('@/views/downloads/index.vue'),
  //       //     meta: {
  //       //       ...meta,
  //       //       hidden: true,
  //       //     },
  //       //   },
  //       // ]
  //       //   .concat(
  //       //     application.map(({ name, url, baseroute, ...resetProps }) => {
  //       //       const microAppName = `${base}_${name}`;

  //       //       return {
  //       //         path: `/${base + baseroute}/:page*`,
  //       //         name: microAppName,
  //       //         component: () => import('@/views/micro/index.vue'),
  //       //         meta: {
  //       //           ...meta,
  //       //           micro: name,
  //       //           hidden: true,
  //       //         },
  //       //         props: {
  //       //           mainBaseRoute,
  //       //           name: microAppName,
  //       //           url: isURL(url) ? url : window.location.origin + url,
  //       //           baseroute: mainBaseRoute + baseroute,
  //       //           ...resetProps,
  //       //         },
  //       //       };
  //       //     }),
  //       //   )
  //       //   .concat([
  //       //     {
  //       //       path: `/${base}/:pathMatch(.*)`,
  //       //       name: '404',
  //       //       component: () => import('@/views/not-found/index.vue'),
  //       //       meta: {
  //       //         ...meta,
  //       //         hidden: true,
  //       //       },
  //       //     },
  //       //   ]),
  //       beforeEnter: async () => {
  //         // await setupPermission(code);
  //       },
  //     };
  //   },
  // );

  const router = createRouter({
    history: createWebHistory(PUBLIC_PATH),
    routes: [
      {
        path: '/',
        name: 'app-center',
        component: NotFound,
        props: {
          items: apps,
        },
        meta: {
          hidden: true,
        },
      },
      ...routeModules,
      ...noAsideRouteModules,
      // ...microRouteModules,
      {
        path: '/:pathMatch(.*)',
        name: '404',
        component: NotFound,
        props: {
          items: apps,
        },
        meta: {
          hidden: true,
        },
      },
    ],
    scrollBehavior: () => ({
      top: 0,
      left: 0,
    }),
  });

  // 默认系统
  let defaultApp;

  // // 已授权的系统集合
  // const accessApp = apps.filter(({ accessFlag }) => accessFlag === 'Y');

  // if (accessApp.length === 1) {
  //   [defaultApp] = accessApp;
  // } else if (accessApp.length > 1) {
  //   defaultApp = accessApp.find(({ defaultFlag }) => defaultFlag === 'Y');
  // }

  /**
   * 鉴权判断
   * @param {object} to - 即将要进入的目标
   * @param {object} from - 即将离开的目标
   * @param {object} next - 导航到下一个
   */
  async function auth(to, from, next) {
    const [route] = to.matched;

    // // 待跳转的系统
    // const toApp = apps.find((item) => item.code === to.meta.code);

    // if (toApp) {
    //   defaultApp = toApp;
    //   route.components.default = toApp.accessFlag === 'N' ? AppCenter : Layout;
    // }

    // if (defaultApp) {
    //   // iscApp.value = defaultApp.code;

    //   if (from.path === '/' && to.path === '/') {
    //     next({ name: defaultApp.code });
    //   } else {
    //     next();
    //   }
    // } else {
      next();
    // }
  }

  router.beforeEach(async (to, from, next) => {
    NProgress.configure({ showSpinner: false });

    NProgress.start();

    auth(to, from, next);
  });

  router.afterEach((to) => {
    NProgress.done();

    useTitle(to.meta.title);
  });

  router.onError((error) => {
    console.error(error);
  });

  app.use(router);

  return router;
}
