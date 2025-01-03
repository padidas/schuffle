import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

startApp();

// async start function to enable waiting for refresh token call
async function startApp() {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);

  // attempt to auto refresh token before startup
  try {
    const { executeRefresh } = useAuthStore();
    await executeRefresh();
  } catch {
    // catch error to start app on success or failure
  }

  app.mount('#app');
}