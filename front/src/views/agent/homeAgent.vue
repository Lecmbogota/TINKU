<template>
  <div>
    <nav class="navbar bs-body-bg shadow-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img :src="isotipo" alt="isotipo" height="25" class="d-inline-block align-text-top me-2" />
          <img :src="Logo" alt="logo" height="25" class="d-inline-block align-text-top" />
        </a>
        <h3>agente</h3>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
        <i class="bi bi-power me-3" @click="logout()"></i>
      </div>
    </nav>


    <router-view>
      <Panel v-if="tab === 'Panel'"></Panel>
    </router-view>

  </div>
</template>

<script>
import { logout } from '../../services/authServices.js';

export default {
  data() {
    return {
      user: (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).nombre) || '',
      clientIp: null,
      tab: 'Panel',
    };
  },
  methods: {
    async getUsuarioId() {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log(decodedToken);
        return {
          userId: decodedToken.id,
          rolId: decodedToken.rol_id
        } 
      } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
      }
    },
    async logout() {
      try {
        const { userId, rolId } = await this.getUsuarioId();

        // Realizar una solicitud POST al endpoint de logout
        await logout(userId, rolId);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Logout exitoso, redirigir al usuario a la página de inicio de sesión
        this.$router.push('/');
        // También puedes mostrar un mensaje de éxito al usuario si lo deseas
        this.$toasted.success('Sesión cerrada correctamente');
      } catch (error) {
        // Manejar errores de red o del servidor
        console.error('Error al cerrar sesión:', error);
        this.$toasted.error('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
      }
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

<style scoped></style>
