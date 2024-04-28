import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/login.vue';
import Dashboard from '../components/dashboard.vue';

// Importa jwt-decode directamente desde el CDN
import jwtDecode from 'https://cdn.skypack.dev/jwt-decode';

const routes = [
  { 
    path: '/',
    name: 'login', 
    meta: { requiresAuth: false },  
    component: Login 
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: Dashboard
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function isTokenExpired(token) {
  if (!token) {
    return true;
  }

  const decodedToken = jwtDecode(token); // Corregir aquí

  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  const expirationDate = new Date(decodedToken.exp * 1000);

  return expirationDate < new Date();
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    // Redirige a la página de inicio de sesión si la ruta requiere autenticación y no hay token
    next({ name: '/' });
  } else {
    next();
  }
});

export default router;
