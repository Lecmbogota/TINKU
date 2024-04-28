import { createApp } from 'vue';
import router from './router/routes';
import './style.css';
import App from './App.vue';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
//import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";



createApp(App)
  .use(router)
  .use(ToastPlugin)
  .mount('#app');
