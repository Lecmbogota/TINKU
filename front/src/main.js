import { createApp } from 'vue';
import router from './router/routes';
import './style.css';
import App from './App.vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
  .use(router)
  .use(vuetify)
  .use(ToastPlugin)
  .use(VCalendar, {})
  .mount('#app');
