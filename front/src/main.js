import { createApp } from 'vue';
import router from './router/routes';
import '../src/styles.css';
import App from './App.vue';
import "vuetify/dist/vuetify.css";
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
//import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import { createPinia } from 'pinia'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const pinia = createPinia()
const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives,
})

  app.use(pinia)
  app.use(router)
  app.use(vuetify)
  app.use(ToastPlugin)
  .mount('#app');
