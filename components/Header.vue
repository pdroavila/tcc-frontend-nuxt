<template>
  <!-- Header fixo com altura definida -->
  <header class="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-green-500 z-10 h-16">
    <div class="container mx-auto flex justify-between items-center py-2 px-6">
      <!-- Logotipo -->
      <div class="text-2xl font-bold text-gray-800">
        <img src="/images/logo_fic.png" alt="Logotipo" class="h-12 w-auto cursor-pointer" @click="navigateToForm()"/>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const router = useRouter();

function navigateToForm() {
  router.push(`/`);
}
</script>
