<template>
      <div v-if="isSubmitting" class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50">
          <Loader />
      </div>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center mb-6">Faça o login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <input 
            type="text" 
            v-model="usuario" 
            placeholder="Usuário" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
        </div>
        <div class="mb-6 relative">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="Senha" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
          <button 
            type="button" 
            @click="togglePassword" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <button 
          type="submit" 
          class="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          ENTRAR
        </button>
      </form>
      <div class="mt-4 text-center">
        <a @click="showForgotPassword" class="text-green-500 hover:text-green-600 cursor-pointer">
          Esqueci minha senha
        </a>
      </div>
    </div>
    <ForgotPasswordModal v-if="isForgotPasswordVisible" @close="closeForgotPassword" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import ForgotPasswordModal from './ForgotPasswordModal.vue';
  import { loginAdmin } from '~/services/apiService';
  import { useToast } from "vue-toastification";
  import { useRuntimeConfig } from '#app';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const toast = useToast();
  const config = useRuntimeConfig();
  const usuario = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const isForgotPasswordVisible = ref(false);
  const isSubmitting = ref(true)
  

  onMounted(() => {
    isSubmitting.value = false;
  })

  const handleLogin = async () => {
    const loginData = {
      username: usuario.value,
      password: password.value
    };

    try {
      isSubmitting.value = true;
      const response = await loginAdmin(loginData, config);
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || "Erro durante o login");
      console.error("Erro durante o login:", error);
    }finally{
      isSubmitting.value = false;
    }
  };

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const showForgotPassword = () => {
    isForgotPasswordVisible.value = true;
  };

  const closeForgotPassword = () => {
    isForgotPasswordVisible.value = false;
  };
</script>
