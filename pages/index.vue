<template>
  <div class="flex flex-col items-center bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 mt-6 md:w-3/4">Cursos Disponíveis</h1>

    <div v-if="pending" class="flex flex-col justify-center items-center h-64 space-y-4">
      <Loader />
    </div>

    <!-- Lista de Cursos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg shadow-lg p-4 w-full md:w-3/4">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
        @click="navigateToForm(course.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Loader from '~/components/Loader.vue';

const config = useRuntimeConfig();
const { data: courses, error, pending } = useFetch(`${config.public.apiUrl}/cursos/?format=json`);
const router = useRouter();

function navigateToForm(courseId) {
  router.push(`/inscricao/${courseId}`);
}

onBeforeMount(() => {
  const hash = localStorage.getItem('auth_hash');
  if(hash){
    return router.push(`/acesso/${hash}`);
  }
})
</script>