<template>
  <v-container fluid>
    <!-- Encabezado de la página -->
    <v-row class="mb-5">
      <v-col>
        <h2 class="headline">Administración de Alojamientos</h2>
      </v-col>
    </v-row>

    <!-- Lista de Alojamientos -->
    <v-row>
      <v-col v-for="alojamiento in alojamientos" :key="alojamiento.id" cols="12" md="6" lg="4">
        <v-card class="pa-4 mb-4">
          <v-img :src="alojamiento.imagen" height="200"></v-img>
          <v-card-title class="headline mt-3">{{ alojamiento.nombre }}</v-card-title>
          <v-card-subtitle class="mb-2">{{ alojamiento.descripcion }}</v-card-subtitle>
          <v-card-text class="mb-2">Precio por noche: {{ alojamiento.precio_por_noche }} COP</v-card-text>
          <v-row>
            <v-col>
              <v-btn @click="editarAlojamiento(alojamiento)" color="primary">Editar</v-btn>
            </v-col>
            <v-col>
              <v-btn @click="eliminarAlojamiento(alojamiento)" color="error">Eliminar</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Formulario para Crear o Editar Alojamientos -->
    <v-dialog v-model="mostrarFormulario" max-width="600">
      <v-card>
        <v-card-title>{{ modoEdicion ? 'Editar Alojamiento' : 'Nuevo Alojamiento' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="guardarAlojamiento">
            <v-text-field v-model="nuevoAlojamiento.nombre" label="Nombre"></v-text-field>
            <v-textarea v-model="nuevoAlojamiento.descripcion" label="Descripción"></v-textarea>
            <v-text-field v-model="nuevoAlojamiento.precio_por_noche" label="Precio por noche" type="number"></v-text-field>
            <v-text-field v-model="nuevoAlojamiento.imagen" label="URL de la Imagen"></v-text-field>
            <v-row>
              <v-col>
                <v-btn @click="mostrarFormulario = false">Cancelar</v-btn>
              </v-col>
              <v-col>
                <v-btn type="submit" color="primary">{{ modoEdicion ? 'Guardar' : 'Crear' }}</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Botón para Agregar Nuevo Alojamiento -->
    <v-row>
      <v-col>
        <v-btn @click="mostrarFormulario = true" color="success">Agregar Nuevo Alojamiento</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { obtenerAlojamientos, crearAlojamiento, editarAlojamiento, eliminarAlojamiento } from '@/services/alojamientoService';

export default {
  setup() {
    const alojamientos = ref([]);
    const mostrarFormulario = ref(false);
    const modoEdicion = ref(false);
    const nuevoAlojamiento = ref({
      id: null,
      nombre: '',
      descripcion: '',
      precio_por_noche: null,
      imagen: '',
    });

    const cargarAlojamientos = async () => {
      try {
        alojamientos.value = await obtenerAlojamientos();
      } catch (error) {
        console.error('Error al cargar los alojamientos:', error);
      }
    };

    const editarAlojamiento = (alojamiento) => {
      // Lógica para cargar el alojamiento en el formulario para editar
      nuevoAlojamiento.value = { ...alojamiento };
      modoEdicion.value = true;
      mostrarFormulario.value = true;
    };

    const eliminarAlojamiento = async (alojamiento) => {
      try {
        await eliminarAlojamiento(alojamiento.id);
        cargarAlojamientos();
      } catch (error) {
        console.error('Error al eliminar el alojamiento:', error);
      }
    };

    const guardarAlojamiento = async () => {
      try {
        if (modoEdicion.value) {
          // Lógica para actualizar el alojamiento existente
          await editarAlojamiento(nuevoAlojamiento.value.id, nuevoAlojamiento.value);
        } else {
          // Lógica para crear un nuevo alojamiento
          await crearAlojamiento(nuevoAlojamiento.value);
        }

        // Limpiar el formulario y cerrar el diálogo
        nuevoAlojamiento.value = { id: null, nombre: '', descripcion: '', precio_por_noche: null, imagen: '' };
        modoEdicion.value = false;
        mostrarFormulario.value = false;

        // Recargar la lista de alojamientos
        cargarAlojamientos();
      } catch (error) {
        console.error('Error al guardar el alojamiento:', error);
      }
    };

    // Cargar los alojamientos al montar el componente
    onMounted(cargarAlojamientos);

    return {
      alojamientos,
      mostrarFormulario,
      modoEdicion,
      nuevoAlojamiento,
      editarAlojamiento,
      eliminarAlojamiento,
      guardarAlojamiento,
    };
  },
};
</script>

<style scoped>
/* Estilos específicos para el componente si es necesario */
</style>
