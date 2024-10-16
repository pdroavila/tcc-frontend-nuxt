<template>
    <div v-if="isLoading" class="flex flex-col justify-center items-center h-64 space-y-4">
      <Loader />
    </div>
    <div>
      <MultiSectionForm v-if="initialData !== null" :courseId="courseId" :initialData="initialData" :hash="hash" />
    </div>
  </template>
  
  <script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import MultiSectionForm from '~/components/MultiSectionForm.vue';
  import { fetchInscricao } from '~/services/apiService';  
  import Loader from '~/components/Loader.vue';
  import { useAuth } from '~/composables/useAuth';

  
  const { authHash, checkAuthHash, logout } = useAuth();
  const isLoading = ref(true);
  const route = useRoute();
  const router = useRouter();

  const inscricaoId = route.params.id;
  const courseId = ref(0);
  const initialData = ref(null);
  const config = useRuntimeConfig();

  onMounted(async () => {
    try {
        isLoading.value = true;
        const response = await fetchInscricao(inscricaoId,authHash.value,config);
        initialData.value = response;  
        courseId.value = response.curso.id;
    } catch (error) {
      console.error('Erro ao buscar a inscrição:', error);
      initialData.value = {};
      console.log(authHash)
      return router.push(`/acesso/${authHash.value}`);
    } finally{
        isLoading.value = false;
    }
  });
  </script>
  