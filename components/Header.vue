<template>
  <header class="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-green-500 z-10 h-16">
    <div class="container mx-auto flex justify-between items-center py-2 px-6">
      <div class="text-2xl font-bold text-gray-800">
        <img src="/images/logo_fic.png" alt="Logotipo" class="h-12 w-auto cursor-pointer" @click="navigateToForm()" />
      </div>
      <div v-if="authCandidato || isAuthenticated" class="font-bold text-green-700 flex gap-6">
        <button @click="meus_cursos" v-if="!isAuthenticated">
          MEUS CURSOS
        </button>
        <button @click="dashboard" v-if="isAuthenticated">
          DASHBOARD
        </button>
        <button @click="cursos" v-if="isAuthenticated">
          CURSOS
        </button>
        <button @click="sair">
          SAIR
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
const { isAuthenticated, authHash, checkAuthHash, logout, logoutAdmin } = useAuth();

const authCandidato = computed(() => authHash.value !== null);
const router = useRouter();

const navigateToForm = () => {
  router.push(`/`);
};

const meus_cursos = () => {
  router.push(`/acesso/${authHash.value}`);
};

const dashboard = () => {
  router.push(`/admin/dashboard`);
}

const cursos = () => {
  router.push(`/admin/cursos/`);
}

const sair = () => {
  if (isAuthenticated.value) {
    logoutAdmin();
  } else {
    logout();
  }
  router.push(`/`);
};
</script>
