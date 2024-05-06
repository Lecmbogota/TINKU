<template>
    <div>
      <nav class="navbar bs-body-bg shadow-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img :src="isotipo" alt="isotipo"  height="25" class="d-inline-block align-text-top me-2" />
            <img :src="Logo" alt="logo"  height="25" class="d-inline-block align-text-top" />
          </a>
          <h3>agente</h3>
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
          <i class="bi bi-power me-3" @click="salir()"></i>
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
      isotipo: isotipo
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
        this.clientIp = data.ip;
      } catch (error) {
        console.error('Error al obtener la dirección IP:', error);
      }
    }
  },
  created() {
    this.fetchIpAddress();
  }
};
</script>
<style scoped>
</style>
