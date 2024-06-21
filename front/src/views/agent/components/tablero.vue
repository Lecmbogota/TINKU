<template>
  <v-app>
    <div class="call-assistant">
      <!-- Panel izquierdo: Tabs para Historial de Llamadas y Redes Sociales -->
      <div class="call-history card shadow">
        <v-tabs v-model="activeTab" bg-color="primary">
          <v-tab value="historyCalls">Historial de Llamadas</v-tab>
          <v-tab value="rrss">Redes Sociales</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="activeTab">
          <input type="text">
              <input type="search" name="searchCalls" id="searchCalls">
            <v-tabs-window-item value="historyCalls">
                <ul class="list-group list-group-flush m-0 p-0">
                  <li
                    class="list-group-item "
                    v-for="call in callHistory"
                    :key="call.id"
                  >
                    <div class="call-history-item">
                      <div class="call-history-info">
                        <p class="call-history-number">{{ call.number }}</p>
                        <p class="call-history-status">{{ call.status }}</p>
                      </div>
                      <div class="call-history-time">{{ call.time }}</div>
                    </div>
                  </li>
                </ul>
              
            </v-tabs-window-item>

            <v-tabs-window-item value="rrss"> rrss </v-tabs-window-item>

            <v-tabs-window-item value="three"> Three </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>

        <v-tabs-items v-model="activeTab">
          <!-- Tab Historial de Llamadas -->
          <v-tab-item> </v-tab-item>

          <!-- Tab Redes Sociales -->
          <v-tab-item>
            <div class="card-body">
              <!-- Aquí iría el contenido relacionado con redes sociales -->
              <ul class="list-group list-group-flush">
                <li
                  class="list-group-item"
                  v-for="social in socialMediaHistory"
                  :key="social.id"
                >
                  <div class="social-media-history-item">
                    <div class="social-media-history-info">
                      <p class="social-media-platform">{{ social.platform }}</p>
                      <p class="social-media-message">{{ social.message }}</p>
                    </div>
                    <div class="social-media-time">{{ social.time }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>

      <!-- Panel central: Display de Teléfono y Botones de Control -->
      <div class="phone-display card shadow">
        <div class="card-body">
          <!-- Número de teléfono -->
          <div class="phone-number">
            <input
              v-model="callNumber"
              class="form-control"
              :class="{
                'is-invalid': callStatus === 'idle' && callNumber.length === 0,
              }"
              placeholder="Número de teléfono"
              @keydown.enter="handleEnter"
            />
          </div>

          <!-- Botones de control -->
          <div class="call-actions mt-4">
            <button
              v-if="callStatus === 'idle'"
              @click="makeCall"
              class="btn btn-success"
            >
              <i class="bi bi-telephone-fill"></i> Llamar
            </button>
            <button v-else @click="endCall" class="btn btn-danger">
              <i class="bi bi-telephone-x-fill"></i> Colgar
            </button>
            <button
              @click="holdCall"
              v-if="callStatus === 'inCall'"
              class="btn btn-warning"
            >
              <i class="bi bi-pause-fill"></i> Pausa
            </button>
            <button
              @click="resumeCall"
              v-if="callStatus === 'hold'"
              class="btn btn-info"
            >
              <i class="bi bi-play-fill"></i> Reanudar
            </button>
          </div>
        </div>
      </div>

      <!-- Panel derecho: Resumen de Llamadas -->
      <div class="call-summary card shadow">
        <div class="card-body">
          <h5 class="card-title">Resumen de Llamadas</h5>
          <div class="call-summary-item">
            <div class="call-summary-label">Total de Llamadas:</div>
            <div class="call-summary-value">{{ totalCalls }}</div>
          </div>
          <div class="call-summary-item">
            <div class="call-summary-label">Llamadas Contestadas:</div>
            <div class="call-summary-value">{{ answeredCalls }}</div>
          </div>
          <div class="call-summary-item">
            <div class="call-summary-label">Llamadas No Contestadas:</div>
            <div class="call-summary-value">{{ missedCalls }}</div>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      callStatus: "idle", // idle, calling, ringing, inCall, hold
      callNumber: "",
      callHistory: [],
      socialMediaHistory: [],
      totalCalls: 0,
      answeredCalls: 0,
      missedCalls: 0,
      activeTab: 0, // Controla la tab activa
    };
  },
  methods: {
    makeCall() {
      // Lógica para iniciar la llamada (simulada en este ejemplo)
      if (this.callNumber.length === 0) {
        // Mostrar error si no hay número de teléfono
        this.callStatus = "idle";
        return;
      }

      this.callStatus = "calling";
      setTimeout(() => {
        this.callStatus = "inCall";
        this.totalCalls++;
        this.answeredCalls++;
        this.addToCallHistory(this.callNumber, "Llamada realizada");
      }, 2000);
    },
    endCall() {
      // Lógica para finalizar la llamada
      this.callStatus = "idle";
      this.callNumber = "";
      this.addToCallHistory(this.callNumber, "Llamada finalizada");
    },
    holdCall() {
      // Lógica para poner la llamada en pausa
      if (this.callStatus === "inCall") {
        this.callStatus = "hold";
      }
    },
    resumeCall() {
      // Lógica para reanudar la llamada desde la pausa
      if (this.callStatus === "hold") {
        this.callStatus = "inCall";
      }
    },
    handleEnter(event) {
      if (event.key === "Enter") {
        if (this.callStatus === "idle") {
          this.makeCall();
        } else {
          this.endCall();
        }
      }
    },
    addToCallHistory(number, status) {
      const currentTime = new Date().toLocaleTimeString();
      this.callHistory.unshift({
        id: Date.now(),
        number,
        status,
        time: currentTime,
      });
    },
  },
};
</script>

<style scoped>
.call-assistant {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.phone-display,
.call-history,
.call-summary {
  width: calc(33.33% - 20px);
  min-width: 300px;
}

.card-body {
  text-align: center;
  padding: 20px;
}

.call-status {
  margin-bottom: 10px;
  font-size: 1.2rem;
  text-align: center;
}

.phone-number {
  margin-bottom: 20px;
}

.phone-number input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
  outline: none;
}

.phone-number input.is-invalid {
  border-color: #dc3545;
}

.dial-pad {
  padding: 10px;
  border-radius: 12px;
  background-color: #f5f5f5;
}

.dial-pad-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.btn {
  width: 100%;
  height: 60px;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-warning {
  background-color: #ffc107;
  color: #333;
}

.btn-info {
  background-color: #17a2b8;
  color: #fff;
}

.btn i {
  margin-right: 5px;
}

.call-summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.call-summary-label {
  font-weight: bold;
}

.call-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.call-history-info {
  flex-grow: 1;
  text-align: left;
}

.call-history-number {
  font-weight: bold;
}

.call-history-time {
  font-size: 0.8rem;
  color: #6c757d;
}
</style>
