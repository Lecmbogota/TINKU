<template>
  <div class="user-admin-panel">
    <h2>Panel de Usuarios</h2>
    
    <!-- Botón para abrir el modal de creación/edición de usuario -->
    <button class="btn btn-primary mb-4" @click="abrirModal('crear')">Crear Usuario</button>

     <!-- Tabla de usuarios -->
     <table class="table">
      <thead>
        <tr>
          <th scope="col-1">ID</th>
          <th scope="col-7">Nombre</th>
          <th scope="col-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in usuarios" :key="index">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.nombre }}</td>
          <td>
            <button @click="editarUsuario(usuario)" class="btn btn-primary btn-sm mx-2">Editar</button>

          </td>
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
              <button type="submit" class="btn btn-primary" @click="cerrarModal()" >{{ modoModal === 'crear' ? 'Crear Usuario' : 'Guardar Cambios' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser, getAllUsers } from '../services/adminServices';



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
</style>
