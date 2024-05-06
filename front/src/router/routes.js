import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/login.vue';
import HomeAdmin from '../views/admin/homeAdmin.vue';
import HomeAgent from '../views/agent/homeAgent.vue';

const routes = [
  { 
    path: '/',
    name: 'login', 
    meta: { requiresAuth: false },  
    component: Login 
  },
  {
    path: '/homeAdmin',
    name: 'homeAdmin',
    meta: { requiresAuth: true, role: 1 },
    component: HomeAdmin
  },
  {
    path: '/homeAgent',
    name: 'homeAgent',
    meta: { requiresAuth: true, role: 2 },
    component: HomeAgent
  },
  {
    // Esta ruta manejará cualquier otra ruta no definida
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' } // Redirige a la ruta de login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // Verificamos si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!token) {
      // Si no hay token, redirigimos al inicio de sesión
      return next({ name: 'login' });
    }
    // Decodificamos el token para obtener la información del usuario
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userRole = decodedToken.rol_id;

    // Verificamos si el rol del usuario coincide con el requerido para la ruta
    if (userRole !== to.meta.role) {
      // Si no coincide, redirigimos al usuario a la página correspondiente a su rol
      return next({ name: userRole === 1 ? 'homeAdmin' : 'homeAgent' });
    }
  }

  // Si la ruta no requiere autenticación o el usuario tiene permiso para acceder a ella, continuamos
  next();
});

export default router;
