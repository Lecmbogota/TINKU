<template>
  <div class="container-fluid d-flex flex-column m-0 p-0">
    <div class="d-flex flex-grow-1 ">
      <!-- Columna de contactos -->
      <div class="col-3 elevation-7 m-0 p-0 bg-white d-flex flex-column " style="z-index: 100">
        <div class="main1 m-0 p-0 mb-2">

          <!-- Encabezado de Columna de contactos -->
          <div class="d-flex justify-content-start align-items-center"
            style=" background-color: #eeeeee; height: 62px;">
            <h4 class="mx-4 ">Chats</h4>
            <div class="input-group p-3">
              <span class="input-group-text" style="border-right: none;" id="basic-addon1"><i
                  class="bi bi-search"></i></span>
              <input type="text" class="form-control borderer" placeholder=" Busca un chat" aria-label="search"
                aria-describedby="basic-addon1">
            </div>
          </div>

          <!-- Cuerpo de Columna de contactos -->
          <hr class="m-0 d-flex flex-column ">
          <div style="overflow-y: auto; max-height: calc(100vh - 209px)">
            <!-- Ajusta la altura máxima según tus necesidades -->
            <div v-for="contact in contacts" :key="contact.id" @click="selectContact(contact)"
              :class="{ 'active': contact === currentContact }" class="contact px-2 contact-history">

              <div class="avatar">{{ contact.name.charAt(0) }}</div>
              <div class="contact-details">
                <div class="row">
                  <div class="col-12">
                    <a style="font-size: 16px;"><strong>{{ contact.name }}</strong></a>
                  </div>
                  <div class="col-12 d-flex justify-content-start align-items-center">
                    <a style="font-size: 14px;">{{ getLastMessage(contact) }}</a>
                  </div>
                  <div class="col-12 d-flex justify-content-end align-items-end">
                    <a style="font-size: 10px; margin-right: 8px; margin-top: -3px;"><strong>Última vez: </strong>{{
                      getLastHoraMsg(contact) }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Columna del chat -->
      <div class="col elevation-1 m-0 p-0 d-flex flex-column flex-grow-1">
        <div class="main m-0 p-0">

          <!-- Encabezado de Columna de chat -->
          <div v-if="currentContact" class="chat-header" style="height: 70px;">
            <div class="row d-flex align-items-center ">
              <div class=" col-auto  row px-6 pt-2">
                <div class="col-auto m-0 p-0">
                  <div class="avatar-2">{{ currentContact.name.charAt(0) }}</div>
                </div>
                <div class="col row m-0 p-0">

                  <h4>{{ currentContact.name }}</h4>


                </div>
              </div>


              <div class="col m-0 p-0 text-end me-2">
                <button class="btn btn-sm bg-white shadow-sm" @click="toggleShowInfo">
                  <i :class="{ 'bi bi-caret-right-fill': showInfo, 'bi bi-caret-left-fill': !showInfo }"></i>

                </button>
              </div>

            </div>
          </div>

          <!-- Cuerpo de Columna de chat -->
          <div ref="chatHistory" class="chat-history custom-scroll mb-4" style=" overflow-y: auto; overflow-x: hidden;">
            <div class="bg-chat" :style="{ backgroundImage: 'url(' + bgChat + ')' }"></div>
            <!--listado de burbujas de la conversacion-->
            <div v-if="currentContact" class="m-4">
              <div v-for="(message, index) in currentContact.messages" :key="index" class="message"
                :class="{ 'sent': message.sender === 'Agente', 'received': message.sender === 'Cliente' }">

                <div class="message-container  "
                  :class="{ 'sent': message.sender === 'Agente', 'received': message.sender === 'Cliente' }">

                  <div v-if="message.sender === 'Cliente'" class="avatar-cliente shadow-sm">{{
                    currentContact.name.charAt(0) }}
                  </div>

                  <div class="message-content shadow-sm">
                    <div class="row px-1">

                      <!--contenido del mensaje-->
                      <div class="col-12">
                        {{ message.text }}
                      </div>

                      <!--hora del mensaje -->
                      <div class="col-12 mt-0 text-gray" style="font-size: 10px"
                        :class="{ 'text-start': message.sender === 'Agente', 'text-end': message.sender === 'Cliente' }">

                        {{ message.horaMsg }}

                      </div>

                    </div>
                  </div>

                  <div v-if="message.sender === 'Agente'" class="avatar-agente shadow-sm"><i class="bi bi-headset"></i>
                  </div>

                </div>
              </div>
            </div>

          </div>


        </div>
      </div>
      <!-- Columna de pestañas -->
      <div v-if="showInfo" class="col-3 m-0 p-0 elevation-7 bg-white d-flex flex-column"
        style=" height:500px; z-index:100">

        <v-tabs v-model="tab" bg-color="gray" style="height:62px; background-color: #eeeeee">

          <v-tab value="Perfil" style="height:70px"> <i class="bi bi-person-vcard-fill me-1"></i> Perfil</v-tab>
          <v-tab value="tipificar" style="height:70px"><i class="bi bi-card-list me-1"></i> {{ this.optionButton
            }}</v-tab>

        </v-tabs>
        <hr class="m-0 p-0" />
        <v-card-text class="m-0 p-0">
          <v-tabs-window v-model="tab" class="m-0 p-0">

            <!-- seccion de perfil -->
            <v-tabs-window-item value="Perfil">
              <div v-show="currentContact" class="">

                <div class="row m-0 p-0">
                  <div class="col-12 d-flex justify-content-center">
                    <div class="avatar-3">{{ currentContact.name.charAt(0) }}</div>
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
      <div class="bg-white fixed-bottom-container p-0">
        <hr class="m-0 p-0">
        <!--textarea para enviar un msg-->
        <div :class="{ 'chat-input': true, 'disabled': !currentContact }">
          <ul v-if="showRepliesList" class="quick-replies-list">
            <li v-for="reply in quickReplies" :key="reply.id" @click="selectQuickReply(reply.value)">{{ reply.text }}
            </li>
          </ul>
          <textarea v-model="newMessage" :rows="numRows" type="text"
            placeholder="Comience con '/' para seleccionar una respuesta predefinida."
            class="form-control rounded resize-textarea no-focus-outline" :disabled="!currentContact"
            @keydown.enter.prevent="sendMessage"></textarea>
        </div>
        <div class="row m-0 p-0">
          <div class="col-6 d-flex justify-content-start">
            <button class="btn btn-sm bg-grey-lighten-2 me-2" :disabled="!currentContact"><i
                class="bi bi-paperclip"></i></button>
            <button class="btn btn-sm bg-grey-lighten-2" :disabled="!currentContact"><i class="bi bi-info"></i></button>
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
</template>

<script>
import { getmsg, sendmsg } from '../services/agentServices';
import analisys from '../../src/assets/img/analisys.svg';
import bgChat from '../../src/assets/img/bgChat.jpg';

export default {
  data() {
    return {
      showInfo: false,
      tab: null,
      firstname: '',
      lastname: '',
      contacts: [],
      contactss: [],
      currentContact: null,
      newMessage: '',
      optionButton: 'tipificacion',
      analisys: analisys,
      bgChat: bgChat,
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
  mounted() {
    // Agregar un listener de evento de teclado cuando el componente se monta
    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeUnmount() {
    // Remover el listener de evento de teclado antes de que el componente sea desmontado
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    handleKeyDown(event) {
      // Verificar si se presionó la combinación Ctrl + A
      if (event.altKey && event.key === 'a' && this.currentContact !== null) {
        event.preventDefault(); // Prevenir el comportamiento por defecto (seleccionar todo el texto)

        // Ejecutar la función que deseas
        this.toggleShowInfo();
      }
    },
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
    getLastHoraMsg(contact) {
      if (contact.messages && contact.messages.length > 0) {
        for (let i = contact.messages.length - 1; i >= 0; i--) {
          const message = contact.messages[i];
          if (message.horaMsg) {
            return message.horaMsg;
          }
        }
      }
      return '';
    },
    handleScroll() {
      // Verificar si el usuario ha hecho scroll activamente hacia arriba
      const chatHistory = this.$refs.chatHistory;
      const atBottom = chatHistory.scrollHeight - chatHistory.clientHeight <= chatHistory.scrollTop + 1;

      // Si no ha hecho scroll activo hacia arriba, mover al final
      if (atBottom) {
        chatHistory.scrollTop = chatHistory.scrollHeight - chatHistory.clientHeight;
      }
    },
    toggleShowInfo() {
      this.showInfo = !this.showInfo
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
  background-color: #dcdcdc;
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
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.avatar-cliente {
  width: 35px;
  height: 35px;
  background-color: rgb(248, 203, 158);
  border-radius: 25% 0 25% 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 20px;
  margin-right: 5px;
}

.avatar-agente {
  width: 35px;
  height: 35px;
  background-color: rgb(136, 182, 215);
  border-radius: 0 25% 0 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.contact-details {
  flex: 1;
}

.form-control:focus {
  border-color: rgb(228, 228, 228) !important;
  outline: 10px;
  box-shadow: none;
}

/* Estilos para el área principal */
.main {
  padding: 20px;
  /* Ajuste de altura para el chat */
  height: calc(100vh - 120px);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main1 {
  height: calc(100vh - 150px);
}

.bg-chat {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../src/assets/img/bgChat.jpg');
  background-repeat: repeat;
  /* La imagen se repetirá tanto horizontal como verticalmente */
  background-size: 400px;
  /* Mantiene el tamaño original de la imagen para que se repita */
  background-position: center;
  opacity: 0.2;
  /* Ajusta la opacidad según lo requieras */
  z-index: -1;
  /* Coloca la imagen detrás del contenido del chat */
  filter: grayscale(100%);
}


.text-gray {
  color: #ccc
}

.chat-header {
  border-bottom: 1px solid #ccc;
  padding-left: 25px;
  padding-top: 12.5px;
  padding-bottom: 5px;
  background-color: #eeeeee;
}

.chat-history {
  margin-top: none;
  overflow-y: auto;
  /* Scroll vertical automático */
  overflow-x: hidden;
  /* Oculta el scroll horizontal */
}

.contact-history {
  margin-top: none;
  overflow-y: auto;
  /* Scroll vertical automático */
  overflow-x: hidden;
  /* Oculta el scroll horizontal */
}

.message {
  margin-bottom: 20px;
}

.message-content {
  padding: 5px;
  border-radius: 10px;
}

.sent .message-content {
  text-align: end;
  /* Alinea el texto a la derecha dentro de la burbuja */
  background-color: #f6fbff;
  /* Color de fondo */
  width: fit-content;
  width: fit-content;
  max-width: 75%;
  /* Anchura de la burbuja */
  margin-left: auto;
  /* Margen izquierdo automático para alinear la burbuja a la derecha */
}

.system .message-content {
  text-align: center;
  /* Alinea el texto a la derecha dentro de la burbuja */
  background-color: #c2c2c2;
  /* Color de fondo */
  width: 75%;
  /* Anchura de la burbuja */
  margin-left: auto;
  /* Margen izquierdo automático para alinear la burbuja a la derecha */
}

.received .message-content {
  background-color: #fcfcfc;
  /* Color de fondo */
  width: fit-content;
  max-width: 75%;
  /* Anchura de la burbuja */
  margin-right: auto;
  /* Margen derecho automático para alinear la burbuja a la izquierda */
}

input:focus {
  border-width: 1px;
  border-color: black;
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

.custom-scroll {
  height: 95vh;
  overflow: hidden auto;
  /* Oculta la barra de desplazamiento horizontal y permite la barra de desplazamiento vertical */
  scrollbar-width: thin;
  /* Ajusta el ancho de la barra de desplazamiento en Firefox */
  scrollbar-color: #dddddd #f1f1f1;
  /* Color del pulgar y de la pista en Firefox */
}

/* Estilizar la barra de desplazamiento en navegadores basados en WebKit (Chrome, Safari, Edge Chromium) */
.custom-scroll::-webkit-scrollbar {
  width: 12px;
  /* Ajusta el ancho de la barra de desplazamiento */
}

.fixed-bottom-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff2b;
  /* Color de fondo blanco */
  padding: 10px;
  /* Ajusta el espaciado interno según sea necesario */
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  /* Sombra para resaltar el contenedor */
  z-index: 1000;
  /* Ajusta el valor de z-index según sea necesario */
  height: 90px;

}
</style>