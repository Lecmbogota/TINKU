import { createApp } from 'vue';
import router from './router/routes';
import '../src/styles.css';
import App from './App.vue';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
//import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import { createPinia } from 'pinia'


const pinia = createPinia()
const app = createApp(App)


  app.use(pinia)
  app.use(router)
  app.use(ToastPlugin)
  .mount('#app');
