<template>
  <div>
    <nav class="navbar bg-white shadow-sm" style="z-index: 200; height: 60px">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img :src="isotipo" alt="isotipo" height="25" class="d-inline-block align-text-top me-2" />
          <img :src="logo" alt="logo" height="25" class="d-inline-block align-text-top" />
        </a>
        <ul class="nav justify-content-center">
          <li class="nav-item">
            <a class="nav-link" :class="{ 'nav-tab-focus': tab === 'Panel' }" href="#" @click="tab = 'Panel'">Dashboard</a>

          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ 'nav-tab-focus': tab === 'Auditoria' }" href="#" @click="tab = 'Auditoria'"> <strong>Auditoria</strong></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ 'nav-tab-focus': tab === 'Users' }" href="#" @click="tab = 'Users'"> <strong>Configuraciones</strong></a>
          </li>
          
        </ul>
        <div class="nav-item">
          <div class="d-xl-block ps-2">
            <i class="bi bi-circle me-1"></i>
            {{ this.ip }}
            <i class="bi bi-person mx-3 me-1"></i>
            {{ this.nombreUsuario }}
            <i class="bi bi-power mx-3" @click="salir()"></i>
          </div>
        </div>
      </div>
    </nav>
    <router-view>
      <dashboard v-show="tab === 'Panel'"></dashboard>
      <administracion v-show="tab === 'Users'"></administracion>
      <auditoria v-show="tab === 'Auditoria'"></auditoria>
    </router-view>

  </div>
</template>


<script>
import router from '../../router/routes';
import logo from '../../assets/img/logo2.jpg';
import isotipo from '../../assets/img/isotipo.jpg';
import dashboard from './components/dashboard.vue';
import auditoria from './components/auditoria.vue' 

import administracion from './components/configuracion.vue'

export default {
  data() {
    return {
      user: (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).nombre) || '',
      clientIp: null,
      tab: 'Panel',
      logo: logo,
      isotipo: isotipo,
      nombreUsuario: '',
      ip: ''
    };
  },
  // Cambiado de component a components
  components: {
    auditoria,
    administracion,
    dashboard
  },
  methods: {
    salir() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    },
    async fetchIpAddress() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        this.ip = data.ip;
      } catch (error) {
        console.error('Error al obtener la dirección IP:', error);
      }
    },
    async getNombreUsuarioPorId() {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log(decodedToken)
        this.nombreUsuario = decodedToken.nombre;
      } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
      }
    },
  },
  created() {
    this.fetchIpAddress();
    this.getNombreUsuarioPorId()

  }
};


</script>


<style scoped>

.nav-link{
  pointer-events: auto;
  text-decoration: none;
  color: rgb(119, 119, 119);
  font-weight: bold;
}
.nav-link:hover{
  color: rgb(104, 104, 104);
}
.nav-link:focus,
.nav-link:active,
.nav-tab-focus { /* Agregado para el estado activo */
  color: rgb(72, 129, 146);
}
</style>
