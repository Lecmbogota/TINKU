<template>
  <div class="row m-0 p-0">
    <div id="menu" class="sidebar col-2">
      <div class="sidebar-header">   
          <span><strong>Admin</strong></span>Panel
          <hr class="mt-0">
      </div>
      <ul class="sidebar-menu">
        <li class="sidebar-item">
          <a href="#" class="sidebar-link" @click="toggleProfiles">
            <i class="bi bi-person"></i> Perfiles
          </a>
          <ul class="submenu" v-show="showProfiles">
            <li><router-link to="/usuarios" class="sidebar-link"> <i class="bi bi-person"></i> Usuarios</router-link></li>
            <li><router-link to="/roles" class="sidebar-link"> <i class="bi bi-person"></i> Roles</router-link></li>
          </ul>
        </li>
        <li class="sidebar-item">
          <router-link to="/configuraciones" class="sidebar-link">
            <i class="bi bi-gear"></i> Pbx
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/configuraciones" class="sidebar-link">
            <i class="bi bi-gear"></i> Bot
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/configuraciones" class="sidebar-link">
            <i class="bi bi-gear"></i> Ajustes
          </router-link>
        </li>
      </ul>
    </div>
    <div id="adminUsers" class="col" style="margin-left:200px">
      <router-view>
        <adminUsers></adminUsers>
      </router-view>
    </div>
  </div>
</template>

<script>
import adminUsers from '@/views/adminUsers.vue'
export default {
  name: 'Sidebar',
  components: {
    adminUsers
  },
  data() {
    return {
      showProfiles: false
    };
  },
  methods: {
    toggleProfiles() {
      this.showProfiles = !this.showProfiles;
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 200px;
  background-color: #343a40;
  color: #fff;
  padding-top: 20px;
  z-index: 1;
}

.sidebar-header {
  margin-top: 25%;
  padding: 0 ;
  font-size: 1.2rem;
  text-align: center;
}

.sidebar-brand {
  font-size: 1.25rem;
  color: #fff;
  text-decoration: none;
}

.sidebar-menu {
  list-style-type: none;
  padding-left: 0;
  margin-top: 20px;
}

.sidebar-item {
  margin-bottom: 10px;
}

.sidebar-link {
  display: block;
  color: #adb5bd;
  text-decoration: none;
}

.sidebar-link:hover {
  color: #fff;
}

.bi {
  margin-right: 5px;
}
.submenu {
  list-style-type: none;
  margin-left: 10px;
  display: none;
}

.submenu li {
  margin-bottom: 5px;
}

.sidebar-link + .submenu,
.submenu {
  display: block;
}
</style>
