<template>
  <div
    class="bg-white shadow-md rounded-lg p-6 flex flex-col items-center border cursor-pointer hover:bg-gray-100 hover:shadow-lg transition duration-300 transform hover:scale-[1.04]"
  >
    <div class="text-center">
      <h2 class="text-xl font-bold mb-2">{{ course.nome }}</h2>
      <p class="text-gray-600">{{ course.descricao }}</p>
      <p class="text-gray-600">
        Carga Horária: {{ course.carga_horaria }} Horas
      </p>
      <p class="text-gray-600" v-if="course.requisitos">
        Requisitos: {{ course.requisitos }}
      </p>
      <span
        v-if="course.status !== undefined && course.status !== null"
        class="text-gray-600"
      >
        {{
          course.status === 0
            ? "Em análise"
            : course.status === 1
            ? "Deferida"
            : "Indeferida"
        }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
};
</script>
