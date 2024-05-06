<template>
  <div>
    <nav class="navbar bs-body-bg shadow-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img :src="isotipo" alt="isotipo" height="25" class="d-inline-block align-text-top me-2" />
          <img :src="Logo" alt="logo" height="25" class="d-inline-block align-text-top" />
        </a>
        <div class="nav-item">
          <div class="d-xl-block ps-2">
            <i class="bi bi-circle me-1"></i>
            <strong>{{ this.ip }}</strong>
            <i class="bi bi-person mx-3 me-1"></i>
            <strong>{{ this.nombreUsuario }}</strong>
            <i class="bi bi-power mx-3" @click="salir()"></i>
          </div>
        </div>
      </div>
    </nav>
    <router-view>
      <Panel v-if="tab === 'Panel'"></Panel>
    </router-view>

  </div>
</template>


<script>
import router from '../../router/routes';
import logo from '../../assets/img/logo2.jpg';
import isotipo from '../../assets/img/isotipo.jpg';
import Panel from '@/views/panelDeControl.vue';

export default {
  data() {
    return {
      user: (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).nombre) || '',
      clientIp: null,
      tab: 'Panel',
      Logo: logo,
      isotipo: isotipo,
      nombreUsuario: '',
      ip: ''
    };
  },
  // Cambiado de component a components
  components: {
    Panel
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
        this.nombreUsuario = decodedToken.nombre;
        console.log(this.nombreUsuario)
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
<style scoped></style>
