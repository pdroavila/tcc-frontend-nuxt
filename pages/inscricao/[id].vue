<template>
    <div>
      <MultiSectionForm :courseId="courseId" />
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import MultiSectionForm from '~/components/MultiSectionForm.vue';
  
  const route = useRoute();
  const courseId = route.params.id;  // Obtendo o ID da rota
  </script>
  