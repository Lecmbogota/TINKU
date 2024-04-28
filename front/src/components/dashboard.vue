<template>
    <div>
        <v-layout style="height: 48px">
            <v-system-bar window class="elevation-4 navbar-color pa-0 ma-0" style="height: 48px">
                <img :src="Logo" alt="logo" class="img-fluid mx-2" style="height: 35px;" />
                
                <v-spacer></v-spacer>

                <v-tabs class="pa-0 ma-0 " v-model="tab" align-tabs="center">
                    <v-tab value="Panel" class="px-4 ma-0">
                        <i class="bi bi-collection me-2"></i> Dashboard
                    </v-tab>
                    <v-tab value="Alojamientos" class="px-4 ma-0">
                        <i class="bi bi-collection me-2"></i> Alojamientos
                    </v-tab>
                </v-tabs>

                <v-spacer></v-spacer>
                <a class="nav-link me-3 pe-none fs-6"><i class="bi bi-globe-americas me-2"></i> {{ clientIp }}</a>
                <a class="nav-link me-3 pe-none fs-6"><i class="bi bi-person-square me-2"></i>{{ user }}</a>
                <v-btn icon="bi bi-power" variant="text-danger" class="me-2 text-danger fs-6"
                    @click.prevent="salir"></v-btn>
            </v-system-bar>
        </v-layout>
<router-view>
    <Panel v-if="tab === 'Panel'"></Panel>
    <Alojamientos v-if="tab === 'Alojamientos'"></Alojamientos>
</router-view>

    </div>
</template>

  
<script>
import router from '../router/routes';
import logo from '../assets/img/logo.png';
import Panel from '@/views/panelDeControl.vue';
import Alojamientos from '@/views/alojamientos.vue';

export default {
  data() {
    return {
      user: (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).nombre) || '',
      clientIp: null,
      tab: 'Panel',
      Logo: logo
    };
  },
  // Cambiado de component a components
  components: {
    Panel,
    Alojamientos,
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
/* Estilos específicos del componente */
</style>
