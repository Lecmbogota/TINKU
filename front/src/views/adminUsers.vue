<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-brand">
        <span>Admin</span>Panel
      </router-link>
    </div>
    <ul class="sidebar-menu">
      <li class="sidebar-item">
        <router-link to="/usuarios" class="sidebar-link">
          <i class="bi bi-person"></i> Usuarios
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link to="/roles" class="sidebar-link">
          <i class="bi bi-shield-shaded"></i> Roles
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link to="/configuraciones" class="sidebar-link">
          <i class="bi bi-gear"></i> Configuraciones
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
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
  margin-top: 30%;
  padding: 20px 20px 10px;
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
</style>
