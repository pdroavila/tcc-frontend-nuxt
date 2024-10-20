<template>
  <div>
    <Header />
    
    <main class="mt-16 h-[calc(100vh-4rem)] overflow-auto bg-gray-100"> 
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
</script>
