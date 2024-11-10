<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4">Esqueci minha senha</h2>
      <p class="mb-4">
        Insira seu e-mail para receber um link de redefinição de senha.
      </p>
      <form @submit.prevent="handleForgotPassword">
        <div class="mb-4">
          <input
            type="email"
            v-model="email"
            placeholder="E-mail"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="mr-2 px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-100 text-white rounded-md hover:bg-green-200 transition duration-300"
            :disabled="sending"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { recoverSenha } from "~/services/apiService";
import { useToast } from "vue-toastification";

const toast = useToast();
const email = ref("");
const config = useRuntimeConfig();
const sending = ref(false);

const emit = defineEmits(["close"]);

const handleForgotPassword = async () => {
  try {
    sending.value = true;
    const response = await recoverSenha(email.value, config);
    toast.success(response.message);
    emit("close");
  } catch (error) {
    toast.error(error);
  } finally {
    sending.value = false;
  }
};
</script>
