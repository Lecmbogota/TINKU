<template>
  <div class="user-admin-panel">
  <div class="d-flex justify-content-between align-content-center  p-2">
    <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
  <ol class="breadcrumb">
    
    <li class="breadcrumb-item active" aria-current="page"><a >Configuraciones</a></li>
    <li class="breadcrumb-item active" aria-current="page"><a >Perfiles</a></li>
    <li class="breadcrumb-item active" aria-current="page">Roles</li>
  </ol>
</nav>    
    <!-- Botón para abrir el modal de creación/edición de usuario -->
    <button class="btn btn-primary btn-circle mb-4 btn-sm fixed-bottom-right" @click="abrirModal('crear')">
    <i class="bi bi-person-plus-fill"></i>
</button>

  </div>

     <!-- Tabla de usuarios -->
     <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col-auto">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Perfil</th>
          <th scope="col">Conectado</th>
          <th scope="col">Activo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in usuarios" :key="index">
          <td class="m-0 p-0 fs-6">
            <button @click="editarUsuario(usuario)" class="btn btn-primary btn-sm mx-2 btn-small">Editar</button>
          </td>
          <td class="m-0 p-0 fs-6">{{ usuario.id }}</td>
          <td class="m-0 p-0 fs-6">{{ usuario.nombre }}</td>
          <td class="m-0 p-0 fs-6">{{ usuario.rol_id }}</td>
          <td class="m-0 p-0 fs-6">{{ usuario.conectado }}</td>
          <td class="m-0 p-0 fs-6">{{ usuario.activo }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de creación/edición de usuario -->
    <div class="modal" tabindex="-1" role="dialog" :class="{ 'show': showModal }">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoModal === 'crear' ? 'Crear Nuevo Usuario' : 'Editar Usuario' }}</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <!-- Formulario de creación/edición de usuario -->
            <form @submit.prevent="modoModal === 'crear' ? registrarUsuario() : guardarCambiosUsuario()">
              <div class="mb-3">

                <label for="nombre" class="form-label">Nombre:</label>
                <input type="text" id="nombre" v-model="nuevoUsuario.nombre" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="usuario" class="form-label">Usuario:</label>
                <input type="text" id="usuario" v-model="nuevoUsuario.usuario" class="form-control" required>
              </div>
              <div class="mb-3" v-if="modoModal === 'crear'">
                <label for="contraseña" class="form-label">Contraseña:</label>
                <input type="password" id="contraseña" v-model="nuevoUsuario.contraseña" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="rol" class="form-label">Rol:</label>
                <select id="rol" v-model="nuevoUsuario.rol" class="form-select" required>
                  <option value="" disabled>Seleccionar Rol</option>
                  <option value="1">Admin</option>
                  <option value="2">Agente</option>
                </select>                
              </div>
              <button type="submit" class="btn btn-primary btn-sm" @click="cerrarModal()" >{{ modoModal === 'crear' ? 'Crear Usuario' : 'Guardar Cambios' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser, getAllUsers } from '../../../services/adminServices';



export default {
  data() {
    return {
      usuarios: [],
      nuevoUsuario: {
        id: null,
        nombre: '',
        usuario: '',
        contraseña: '',
        rol: null
      },
      showModal: false,
      modoModal: 'crear',

    };
  },
  created() {
    this.getAllUsuarios();
  },
  methods: {
    async getAllUsuarios() {
      try {
        const usuarios = await getAllUsers();
        this.usuarios = usuarios;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    },
    abrirModal(modo) {
      this.modoModal = modo;
      this.showModal = true;
      if (modo === 'crear') {
        this.limpiarFormulario();
      }
    },
    cerrarModal() {
      this.showModal = false;
    },

    async registrarUsuario() {
      // Llamar a la función registerUser para registrar un nuevo usuario
      const { success, user, message } = await registerUser(
        this.nuevoUsuario.nombre,
        this.nuevoUsuario.usuario,
        this.nuevoUsuario.contraseña,
        this.nuevoUsuario.rol
      );

      if (success) {
        // Usuario registrado exitosamente
        console.log('Usuario registrado:', user);
        this.getAllUsuarios();
        // Realizar otras acciones, como redireccionar al usuario a otra página
      } else {
        // Error al registrar usuario
        console.error('Error al registrar usuario:', message);
        // Mostrar un mensaje de error al usuario, si es necesario
      }
    },
    agregarUsuario() {

      // Asignar un ID incremental al nuevo usuario
      this.nuevoUsuario.id = this.usuarios.length + 1;
      // Agregar el nuevo usuario a la lista de usuarios
      this.usuarios.push({ ...this.nuevoUsuario });
      // Cerrar el modal después de agregar el usuario
      this.showModal = false;
    },
    editarUsuario(usuario) {
      // Abrir el modal en modo de edición
      this.modoModal = 'editar';
      this.showModal = true;
      // Rellenar el formulario con los datos del usuario a editar
      this.nuevoUsuario = { ...usuario };
    },
    guardarCambiosUsuario() {
      // Implementar la lógica para guardar los cambios del usuario editado
      // Podrías actualizar los datos del usuario en la lista de usuarios
      // Luego, cerrar el modal después de guardar los cambios
      this.showModal = false;
    },
    eliminarUsuario(index) {
      // Eliminar un usuario de la lista
      this.usuarios.splice(index, 1);
    },
    limpiarFormulario() {
      // Limpiar los campos del formulario
      this.nuevoUsuario = {
        id: null,
        nombre: '',
        usuario: '',
        contraseña: '',
        rol: ''
      };
    }
  }
};
</script>

<style scoped>
/* Estilos específicos del componente */
.user-admin-panel {
  max-width: 100%;
  margin: 0 auto;
}
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.7);
}
.fixed-bottom-right {
    position: fixed;
    bottom: 0px; /* Ajusta la distancia desde el fondo */
    right: 10px; /* Ajusta la distancia desde la derecha */
    z-index: 1000; /* Asegúrate de que esté por encima de otros elementos si es necesario */
}
.btn-circle {
    width: 50px; /* Ajusta el tamaño del botón según sea necesario */
    height: 50px; /* Ajusta el tamaño del botón según sea necesario */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.btn-circle i {
    font-size: 1.5rem; /* Ajusta el tamaño del icono según sea necesario */
}

/* estilos para la tabla */
td{
  vertical-align: middle;
  text-align: start;
  padding: 0px;
  margin: 0px;
}
th{
  vertical-align: middle;
  text-align: start;
  padding: 0px;
  margin: 0px;

}
.btn-small {
    padding: 2px 6px; /* Ajusta el relleno (padding) según sea necesario */
    font-size: 10px; /* Ajusta el tamaño de la fuente según sea necesario */
    line-height: 1.5; /* Ajusta la altura de la línea según sea necesario */
}


</style>
