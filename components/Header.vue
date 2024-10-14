<template>
  <!-- Header fixo com altura definida -->
  <header class="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-green-500 z-10 h-16">
    <div class="container mx-auto flex justify-between items-center py-2 px-6">
      <!-- Logotipo -->
      <div class="text-2xl font-bold text-gray-800">
        <img src="/images/logo_fic.png" alt="Logotipo" class="h-12 w-auto cursor-pointer" @click="navigateToForm()"/>
      </div>
      <div v-if="isAuthenticated" class="font-bold text-green-700 flex gap-6">
        <button @click="courses">
          MEUS CURSOS
        </button>
        <button @click="sair">
          SAIR
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';


// Computed para verificar se o usuário está autenticado
const isAuthenticated = computed(() => authHash.value !== null)
const isMenuOpen = ref(false);
const hash = ref(null);
const router = useRouter();
const { authHash, checkAuthHash, logout } = useAuth();

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function navigateToForm() {
  router.push(`/`);
}

const courses = (event) => {
  router.push(`/acesso/${hash.value}`);
}

const sair = () => {
  logout();
  router.push(`/`);
};

onMounted(() => {
  checkAuthHash();
});

</script>
