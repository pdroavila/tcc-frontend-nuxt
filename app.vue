<template>
  <div>
    <Header />
    
    <main class="mt-16 h-[calc(100vh-4rem)] overflow-auto"> 
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
</script>
