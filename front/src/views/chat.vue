<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Columna de contactos -->
      <div class="col elevation-4 m-0 p-0" style="height:94vh">
        <h4 class="text-center">Contactos</h4>
        <hr class="m-0">
        <div v-for="contact in contacts" :key="contact.id" @click="selectContact(contact)"
        
          :class="{ 'active': contact === currentContact }" class="contact">
          <div class="avatar">{{ contact.name && contact.name.length > 0 ? contact.name.charAt(0) : contact.name }}</div>
          <div class="contact-details">
            <div class="row">
              <div class="col-12 ">
                <a style="font-size: 16px;"><strong>{{ contact.name }}</strong></a>
              </div>
              <div class="col-12 d-flex justify-content-start align-items-center ">
                <!--<i class="bi bi-check text-grey-lighten-1 me-1"></i><a style="font-size: 14px;">{{getLastMessage(contact) }}</a>-->
                <i class="bi bi-check-all text-green-lighten-1 me-1"></i><a style="font-size: 14px;">{{
                  getLastMessage(contact) }}</a>
              </div>
              <div class="col-12 d-flex justify-content-end align-items-end ">
                <a style="font-size: 10px; margin-right: 8px; margin-top: -3px;"><strong>Última vez: </strong>{{ contact }}</a>
              </div>

            </div>
          </div>
        </div>
      </div>


      <!-- Columna del chat -->
      <div class="col-7 elevation-1">
        <div class="main">

          <div v-if="currentContact" class="chat-header">
            <div class="row d-flex align-items-center">
              <div class="col-auto m-0 p-0">
                <div class="avatar-2">{{ currentContact.name && currentContact.name.length > 0 ? currentContact.name.charAt(0) : currentContact.name }}</div>
              </div>
              <div class="col m-0 p-0">
                <h4>{{ currentContact.name }}</h4>
              </div>
              <div class="col m-0 p-0 text-end">
                <button class="btn btn-sm btn-primary">Llamar</button>
              </div>

            </div>
          </div>

          <div v-if="currentContact" class="chat-history">
            <!--listado de burbujas de la conversacion-->
            <div v-for="(message, index) in currentContact.messages" :key="index" class="message"
              :class="{ 'sent': message.sender === 'Agente', 'received': message.sender === 'Cliente' }">
              <div class="message-container"
                :class="{ 'sent': message.sender === 'Agente', 'received': message.sender === 'Cliente' }">
                <div v-if="message.sender === 'Cliente'" class="avatar-cliente">{{ currentContact.name && currentContact.name.length > 0 ? contcurrentContactact.name.charAt(0) : currentContact.name }}
                </div>
                <div class="message-content">{{ message.text }}</div>
                <div v-if="message.sender === 'Agente'" class="avatar-agente"><i class="bi bi-headset"></i></div>
              </div>

            </div>
            <hr class="m-0 p-0">
            <!--textarea para enviar un msg-->
            <div v-if="currentContact" class="chat-input">
              <ul v-if="showRepliesList" class="quick-replies-list">
                <li v-for="reply in quickReplies" :key="reply.id" @click="selectQuickReply(reply.value)">{{ reply.text
                  }}</li>
              </ul>
              <textarea v-model="newMessage" :rows="numRows" type="text"
                placeholder="Shift + enter for new line. Comience con '/' para seleccionar una respuesta predefinida."
                class="form-control rounded resize-textarea  no-focus-outline" @keydown.enter.prevent="sendMessage"
                ></textarea>


            </div>
            <div class="row m-0 p-0">
              <div class="col-6 d-flex justify-content-start">
                <button class="btn btn-sm bg-grey-lighten-2  me-2"><i class="bi bi-paperclip"></i></button>
                <button class="btn btn-sm bg-grey-lighten-2"><i class="bi bi-paperclip"></i></button>
              </div>
              <div class="col-6 d-flex justify-content-end">
                <button @click="sendMessage" class="btn btn-sm btn-primary" :disabled="newMessage.trim() === ''">
                  <i class="bi bi-send me-1"></i>Enviar
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
      <!-- Columna de pestañas -->
      <div class="col-3 m-0 p-0 elevation-4">

        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="Perfil"> <i class="bi bi-person-vcard-fill me-1"></i> Perfil</v-tab>
          <v-tab value="tipificar"><i class="bi bi-card-list me-1"></i> {{ this.optionButton }}</v-tab>

        </v-tabs>

        <v-card-text class="m-0 p-0">
          <v-tabs-window v-model="tab" class="m-0 p-0">

            <!-- seccion de perfil -->
            <v-tabs-window-item value="Perfil">
              <div v-show="currentContact" class="chat-header">

                <div class="row m-0 p-0">
                  <div class="col-12 d-flex justify-content-center">
                    <div class="avatar-3">{{ currentContact.name && currentContact.name.length > 0 ? currentContact.name.charAt(0) : currentContact.name }}</div>
                  </div>
                </div>
                <div class="row m-0 p-0">
                  <div class="col text-center">
                    <h4>{{ currentContact.name }}</h4>
                  </div>
                </div>
                <hr class="m-0 p-0" />


                <div class="px-2">
                  <div class="row m-0 p-0">
                    <div class="col text-start">
                      <a style="font-size: 12px; margin-right: 8px; margin-top: -3px;"><strong> <i
                            class="bi bi-telephone me-1"></i> telefono:
                        </strong>{{ currentContact.phone }}</a>
                    </div>
                  </div>

                  <div class="row m-0 p-0">
                    <div class="col text-start">
                      <a style="font-size: 12px; margin-right: 8px; margin-top: -3px;"><strong><i
                            class="bi bi-map me-1"></i> Direccion:
                        </strong>Activo</a>
                    </div>
                  </div>

                  <div class="row m-0 p-0">
                    <div class="col text-start">
                      <a style="font-size: 12px; margin-right: 8px; margin-top: -3px;"><strong>Conectado:
                        </strong>20:33</a>
                    </div>
                  </div>
                </div>

                <hr class="m-0 p-0" />





              </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="tipificar">
              <section class="row" v-show="optionButton === 'tipificacion'">
                <div class="col-12 mt-4">
                  <img :src="analisys" alt="analisys" class="d-inline-block align-text-top w-100 p-5" />
                </div>
                <div class="col-12 mt-5  px-5 text-center">
                  <v-btn size="large" variant="flat" block class="bg-grey-lighten-2 mx-2"
                    @click="optionButton = 'acepta'"> Acepta </v-btn>
                </div>
                <div class="col-12 mt-5 px-5 text-center">
                  <v-btn size="large" variant="flat" block class="bg-grey-lighten-2 mx-2"
                    @click="optionButton = 'Rechaza'"> Rechaza </v-btn>
                </div>
                <div class="col-12 mt-5 px-5 text-center">
                  <v-btn size="large" variant="flat" block class="bg-grey-lighten-2 mx-2"
                    @click="optionButton = 'Agendar'"> Agendar </v-btn>
                </div>
                <div class="col-12 mt-5 px-5 text-center">
                  <v-btn size="large" variant="flat" block class="bg-grey-lighten-2 mx-2"
                    @click="optionButton = 'NoCalifica'"> No Califica
                  </v-btn>
                </div>
              </section>
              <section v-show="optionButton === 'acepta'">
                <v-form v-model="valid" class="m-0 p-0">
                  <v-container class="m-0 p-0">

                    <v-col cols="12" md="12" class="m-1 p-0">
                      <v-text-field v-model="firstname" :counter="10" :rules="nameRules" label="First name" hide-details
                        required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="12" class="m-1 p-0">
                      <v-text-field v-model="lastname" :counter="10" :rules="nameRules" label="Last name" hide-details
                        required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="12" class="m-1 p-0">
                      <v-text-field v-model="email" :rules="emailRules" label="E-mail" hide-details
                        required></v-text-field>
                    </v-col>
                    <div class="row m-0 p-0">
                      <div class="col-12 d-flex justify-content-end">
                        <v-col cols="12" md="4" sm="6" class="">
                          <v-btn rounded="xl" class="bg-light-green-accent-2 "> Resolver </v-btn>
                        </v-col>
                      </div>
                    </div>



                  </v-container>
                </v-form>
                <v-btn rounded="xl" class="bg-grey-lighten-2" @click="optionButton = 'tipificacion'"> volver </v-btn>
              </section>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>

      </div>
    </div>
  </div>
</template>

<script>
import { getmsg, sendmsg } from '../services/agentServices';
import analisys from '../../src/assets/img/analisys.svg';

export default {
  data() {
    return {
      tab: null,
      firstname: '',
      lastname: '',
      contacts: [],
      contactss: [],
      currentContact: null,
      newMessage: '',
      optionButton: 'tipificacion',
      analisys: analisys,
      quickReplies: [
        { id: 1, text: 'Sí', value: 'Sí, estoy de acuerdo.' },
        { id: 2, text: 'No', value: 'No, estoy en desacuerdo.' },
        { id: 3, text: 'Estoy interesado', value: 'Estoy interesado en tu oferta.' },
        { id: 4, text: 'Más información', value: 'Por favor, proporciona más información.' },
        // Puedes agregar más respuestas rápidas según sea necesario
      ],
      showRepliesList: false,
    };
  },
  computed: {
    numRows() {
      // Limitar el número de filas a un máximo de 5
      return Math.min(5, (this.newMessage.match(/\n/g) || []).length + 1);
    }
  },
  created() {
    // Ejecuta getAllMsg inmediatamente al crear el componente
    this.getAllMsg();

    // Ejecuta getAllMsg cada 5 segundos
    setInterval(() => {
      this.getAllMsg();
    }, 5000);
  },
  methods: {
    checkForSlash() {
      if (this.newMessage.includes('/')) {
        this.showRepliesList = !this.showRepliesList;
      }
    },
    adjustTextAreaHeight() {
      // Ajustar automáticamente la altura del textarea en función del contenido
      const textarea = this.$refs.textarea;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    },
    showQuickReplies() {
      this.showRepliesList = !this.showRepliesList;
    },
    selectQuickReply(reply) {
      this.newMessage = reply;
      this.showRepliesList = false; // Oculta la lista de respuestas rápidas después de seleccionar una
    },
    selectContact(contact) {
      this.currentContact = contact;
    },
    getLastMessage(contact) {
      const lastMessage = contact.messages[contact.messages.length - 1];
      if (lastMessage) {
        if (lastMessage.text.length > 15) {
          return lastMessage.text.substring(0, 15) + ' ...'; // Agregar "..." si supera las 15 letras
        } else {
          return lastMessage.text; // Devolver el mensaje completo si tiene 15 letras o menos
        }
      } else {
        return 'No hay mensajes';
      }
    },
    async getAllMsg() {
      try {
        const response = await getmsg();
        // Asignar directamente la lista de contactos al arreglo de contacts
        this.contacts = response;
        this.contactss = response;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '' && this.currentContact) {
        const messageContent = this.newMessage.trim();
        const contactNumber = this.currentContact.phone;
        // Agregar el nuevo mensaje a la lista de mensajes del contacto actual
        this.currentContact.messages.push({ text: messageContent, sender: "Agente" });

        // Llamar a la función sendMsg para enviar el mensaje al número del contacto actual
        await sendmsg(messageContent, contactNumber);

        // Limpiar el cuadro de texto después de enviar el mensaje
        this.newMessage = '';
      }
    },
  },
  watch: {
    newMessage(newValue) {
      if (newValue.includes('/')) {
        this.showRepliesList = true;
      } else {
        this.showRepliesList = false;
      }
    },
    contacts: {
      deep: true,
      handler(newContacts, oldContacts) {
        // Verifica si hay algún cambio en contacts
        if (newContacts !== oldContacts) {
          // Si currentContact no es nulo, selecciona nuevamente el contacto actual
          if (this.currentContact) {
            // Encuentra el contacto actual en la lista actualizada de contactos
            const updatedContact = newContacts.find(contact => contact.id === this.currentContact.id);
            if (updatedContact) {
              // Selecciona el contacto actualizado
              this.selectContact(updatedContact);
            }
          }
        }
      }
    }
  },
};
</script>


<style scoped>
.no-focus-outline {
  border: none;
  background-color: #49505700;
}


.resize-textarea {
  padding: 0px;
  width: 99%;
  margin: 10px;
  margin-top: 10px;
  margin-bottom: 30px;
  overflow-y: hidden;
  /* Agrega scroll vertical */
  resize: none;
  /* Evita el redimensionamiento manual */
  height: auto;
  /* Establece la altura automática */
  min-height: auto;
  /* Altura mínima inicial */
  max-height: auto;
  /* Altura máxima permitida */
}

/* Estilos para la barra lateral */
.sidebar {
  border-right: 1px solid #ccc;
  height: 100%;
  overflow-y: auto;
}

.contact {
  display: flex;
  align-items: center;
  padding: 2px;
  height: 70px;
  cursor: pointer;
}

.contact:hover {
  background-color: #f0f0f0;
}

.active {
  background-color: #e6f3ef;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  margin-right: 5px;
}

.message-container {
  display: flex;
  align-items: center;
}

.avatar-2 {
  width: 30px;
  height: 30px;
  background-color: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  margin-right: 5px;

}

.avatar-cliente {
  width: 30px;
  height: 30px;
  background-color: #c8c8c8;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  margin-right: 5px;

}

.avatar-agente {
  width: 30px;
  height: 30px;
  background-color: rgb(136, 182, 215);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  margin-left: 5px;

}

.avatar-3 {
  width: 80px;
  height: 80px;
  background-color: #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 40px;
  margin-top: 20px;
}

.contact-details {
  flex: 1;
}

.form-control:focus {
  border-color: #ffffff00 !important;
  outline: 0;
  box-shadow: none;
}

/* Estilos para el área principal */
.main {
  padding: 20px;
  height: calc(100vh - 120px);
  /* Ajuste de altura para el chat */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-header {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.chat-history {
  overflow-y: auto;
}

.message {
  margin-bottom: 20px;
}

.message-content {
  padding: 10px;
  border-radius: 10px;
}

.sent .message-content {
  text-align: end;
  /* Alinea el texto a la derecha dentro de la burbuja */
  background-color: #E3F2FD;
  /* Color de fondo */
  width: 75%;
  /* Anchura de la burbuja */
  margin-left: auto;
  /* Margen izquierdo automático para alinear la burbuja a la derecha */
}

.system .message-content {
  text-align: center;
  /* Alinea el texto a la derecha dentro de la burbuja */
  background-color: #ffebce;
  /* Color de fondo */
  width: 50%;
  /* Anchura de la burbuja */
  margin-left: auto;
  /* Margen izquierdo automático para alinear la burbuja a la derecha */
}

.received .message-content {
  background-color: #ECEFF1;
  /* Color de fondo */
  width: 75%;
  /* Anchura de la burbuja */
  margin-right: auto;
  /* Margen derecho automático para alinear la burbuja a la izquierda */
}

/* Estilos para el área de entrada de texto */
.chat-input {}

.chat-input input {
  width: 70%;
  border-radius: 20px;
}

.chat-input button {
  width: 100px;
}
</style>