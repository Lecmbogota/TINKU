<template>
  <div class="login-container">
    <img :src="loginBG" class="login-bg" alt="Login Background">
    
    <div class="login-content">
      <v-form @submit.prevent="submitForm" class="login-form text-center">
        <img :src="logo" class="logo" alt="Login Background">
        <v-text-field variant="outlined"  v-model="username" label="Usuario" required></v-text-field>
        <v-text-field variant="outlined" v-model="password" label="Contraseña" type="password" required></v-text-field>

        <v-btn :loading="loading" type="submit" block class="mt-2" text="Iniciar Sesion"></v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import loginBG from '../assets/img/bg_login.jpg';
import logo from '../assets/img/logo.png';
import { login } from '../services/authServices';


export default {
  data() {
    return {
      username: '',
      password: '',
      loginBG: loginBG,
      logo: logo,
      loading: false,
    };
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true;
        const response = await login(this.username, this.password);
        this.handleResponse(response);
      } catch (error) {
        console.error('Error:', error);
        // Mostrar un mensaje de error de datos invalidos o de servidor
        if (error.response && error.response.data && error.response.data.error) {
          this.$toast.error(error.response.data.error);
        }
      } finally {
        this.loading = false;
      }
    },
    handleResponse(response) {
      if (response.hasOwnProperty('user') && response.hasOwnProperty('token')) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.$router.push('/dashboard');
        this.$toast.success('Login successful!');
      } else if (response.hasOwnProperty('error')) {
        this.$toast.error(response.error);
      } else {

        this.$toast.error('Error. Please try again.');

      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.login-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.7;
}

.login-content {
  max-width: 400px;
  width: 100%;
  z-index: 1;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);



}


label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;

  &:hover {
    background-color: #45a049;
  }

}

button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

.logo {
  width: 200px;
  margin: 30px;
  margin-bottom: 50px; ;

}
</style>
