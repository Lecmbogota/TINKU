<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="8">
        <!-- Resumen General -->
        <v-card class="mb-4">
          <v-card-title class="headline">Resumen General</v-card-title>
          <v-row>
            <v-col cols="6">

              <v-progress-circular :rotate="360" :size="120" :width="15" :model-value="reservasCompletadasPorcentaje"
                color="success">
                {{ reservasCompletadasPorcentaje }}
              </v-progress-circular>


              <div class="text-center caption mt-2">Completadas</div>
              <div class="text-center headline">{{ reservasCompletadas }}</div>
            </v-col>
            <v-col cols="6">

              <v-progress-circular :rotate="360" :size="120" :width="15" :model-value="reservasPendientes"
                color="warning">
                {{ reservasPendientes }}
              </v-progress-circular>

              <div class="text-center caption mt-2">Pendientes</div>
              <div class="text-center headline">{{ reservasPendientes }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Reservas Recientes -->
        <v-card class="mb-4">
          <v-card-title class="headline">Reservas Recientes</v-card-title>
          <v-list>
            <v-list-item-group v-if="recentBookings.length > 0">
              <v-list-item v-for="booking in recentBookings" :key="booking.id">
                <v-list-item-content>
                  <v-list-item-title>{{ booking.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(booking.checkInDate) }} - {{ formatDate(booking.checkOutDate)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-list-item v-else>
              <v-list-item-content>No hay reservas recientes.</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>



      </v-col>

      <v-col cols="12" lg="4">
        <!-- Alojamientos Disponibles -->
        <v-card class="mb-4">
          <v-card-title class="headline">Alojamientos Disponibles</v-card-title>
          <v-row>
            <v-col cols="12" class="text-center">
              <div class="caption">Total de Alojamientos</div>
              <div class="headline">{{ totalAlojamientos }}</div>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <v-row>
            <v-col cols="6">

              <v-progress-circular :rotate="360" :size="120" :width="15" :model-value="alojamientosOcupadosPorcentaje"
                color="teal">
                {{ alojamientosOcupadosPorcentaje }}
              </v-progress-circular>

              <div class="text-center caption mt-2">Ocupados</div>
              <div class="text-center headline">{{ alojamientosOcupados }}</div>
            </v-col>
            <v-col cols="6">


              <v-progress-circular :rotate="360" :size="120" :width="15" :model-value="alojamientosDisponiblesPorcentaje"
                color="success">
                {{ alojamientosDisponiblesPorcentaje }}
              </v-progress-circular>

              <div class="text-center caption mt-2">Disponibles</div>
              <div class="text-center headline">{{ alojamientosDisponibles }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Estadísticas Generales -->
        <v-card>
          <v-card-title class="headline">Calendario de Reservas</v-card-title>
          <v-calendar v-model="selectedDate" :attributes="reservas" @click:event="handleEventClick"></v-calendar>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: "BookingDashboard",
  data() {
    return {
      reservasCompletadas: 25,
      reservasPendientes: 15,
      totalReservas: 40,
      totalAlojamientos: 50,
      alojamientosOcupados: 20,
      alojamientosDisponibles: 30,
      recentBookings: [
        { id: 1, name: "Cliente 1", checkInDate: "2022-03-01", checkOutDate: "2022-03-05" },
        { id: 2, name: "Cliente 2", checkInDate: "2022-03-10", checkOutDate: "2022-03-15" },
        // Agrega más reservas recientes según sea necesario
      ],
      selectedDate: null,
      reservas: [
        { name: 'Reserva 1', start: '2022-03-05', end: '2022-03-07' },
        { name: 'Reserva 2', start: '2022-03-15', end: '2022-03-18' },
        // Agrega más reservas según sea necesario
      ],
      
      
    };
  },
  setup() {
      const selectedDate = ref(null);
    const reservas = ref([
      {
        highlight: 'blue',
        dates: [
          new Date(2024, 10, 4),
          [new Date(2024, 10, 7), new Date(2024, 10, 9)],
        ],
      },
      {
        highlight: 'blue',
        dates: [[new Date(2024, 10, 17), new Date(2024, 10, 19)]],
      },
      {
        highlight: 'blue',
        
        dates: [[new Date(2024, 10, 20), new Date(2024, 11, 24)]],
        
      },
    ]);

    return {
      selectedDate,
      reservas,
    };
  },
  computed: {
    reservasCompletadasPorcentaje() {
      return (this.reservasCompletadas / this.totalReservas) * 100;
    },
    reservasPendientesPorcentaje() {
      return (this.reservasPendientes / this.totalReservas) * 100;
    },
    alojamientosOcupadosPorcentaje() {
      return (this.alojamientosOcupados / this.totalAlojamientos) * 100;
    },
    alojamientosDisponiblesPorcentaje() {
      return (this.alojamientosDisponibles / this.totalAlojamientos) * 100;
    },
  },
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    handleEventClick(event) {
      // Manejar clic en eventos del calendario según sea necesario
      console.log('Evento clickeado:', event);
    },
  },
};
</script>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: bold;
}

.caption {
  font-size: 0.8rem;
  color: grey;
}

/* Agrega estilos adicionales según sea necesario */
</style>
