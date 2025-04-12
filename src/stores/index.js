import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia().use(piniaPluginPersistedstate);

/**
 *
 * @param {object} app - instance
 */
export function setupStore(app) {
  app.use(store);
}

export { store };
