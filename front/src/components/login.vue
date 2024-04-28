<template>
  <div class="login-container">
    <img :src="loginBG" class="login-bg" alt="Login Background">

    <div class="login-content shadow-lg">
      <v-form @submit.prevent="submitForm" class="login-form text-center">
        <img :src="logo" class="logo" alt="Login Background">
        
        <div class="input-group flex-nowrap">
          <span class="input-group-text" id="addon-wrapping"><i class="bi bi-person-fill"></i></span>
          <input type="text" class="form-control"  v-model="username" placeholder="Usuario" aria-label="Username" aria-describedby="addon-wrapping" required>
        </div>
        
        <div class="input-group flex-nowrap mt-3">
          <span class="input-group-text" id="addon-wrapping"><i class="bi bi-key-fill"></i></span>
          <input type="password" class="form-control" v-model="password" placeholder="Contraseña" aria-label="Username" aria-describedby="addon-wrapping" required>
        </div>

        <button class="btn btn-success mt-5" :loading="loading" type="submit" >
          Iniciar Sesion
        </button>
      </v-form>
    </div>
    <footer class="footer">
      <p class="text-end me-2">© 2024 TINKU. Todos los derechos reservados.</p>
    </footer>
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
  align-items: center;
  justify-content: center;
  position: relative;
}
.logo{

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
  background-color:white;
  height: 100vh;
  max-width: 400px;
  width: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

}
.footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10px;
  background-color:none;
  display: flex;
  align-items: center;
  justify-content: end;
  z-index: 1;
  color: white;
  font-size: 12px;
}

.login-form {

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
  background-color: transparent;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 50%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background-color: #23aca5;
  color: white;

  &:hover {
    background-color: rgb(25, 138, 132);
  }

}

button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

.logo {
  width: 90%;
  margin-bottom: 20px;
  position: sticky;
  
  ;

}
</style>
