<template>
  <div class="flex flex-col items-center  bg-gray-100 h-full">
    <h1 class="text-2xl font-bold mb-6 mt-6 md:w-3/4 ">Cursos Disponíveis</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg shadow-lg p-4 w-full md:w-3/4">
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
const config = useRuntimeConfig()

const { data: courses, error } = await useFetch(`${config.public.apiUrl}/cursos/?format=json`);

if (error.value) {
  console.error('Erro ao buscar cursos:', error.value.message);
}

const router = useRouter();

function navigateToForm(courseId) {
  router.push(`/inscricao/${courseId}`);
}
</script>
