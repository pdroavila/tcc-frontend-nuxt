<template>
  <div class="flex flex-col items-center bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 mt-6 md:w-3/4">Meus Cursos</h1>

    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center h-64 space-y-4"
    >
      <Loader />
    </div>

    <!-- Lista de Cursos -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg shadow-lg p-4 w-full md:w-3/4"
    >
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
        @click="navigateToForm(course.id, hash)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useRoute, useFetch, useRuntimeConfig } from "nuxt/app";
import { ref, onMounted } from "vue";
import { fetchInscricoes } from "~/services/apiService";
import Loader from "~/components/Loader.vue";
import { useToast } from "vue-toastification";
import { useAuth } from "~/composables/useAuth";

const toast = useToast();
const config = useRuntimeConfig();
const inscricoes = ref([]);
const courses = ref([]);
const isLoading = ref(true);
const route = useRoute();
const hash = route.params.hash;
const router = useRouter();
const { authHash, checkAuthHash, logout } = useAuth();

const navigateToForm = (courseId) => {
  if (hash) {
    sessionStorage.setItem("hash", hash);
  }

  router.push({ path: `/inscricao/alterar/${courseId}` });
};

onBeforeMount(() => {
  localStorage.setItem("auth_hash", hash);
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const inscricoesData = await fetchInscricoes(hash, config);

    if (!inscricoesData.length) {
      logout();
      router.push(`/`);
      toast.error("Inscrição não encontrada.");
      return;
    }

    inscricoes.value = inscricoesData;

    courses.value = inscricoesData.flatMap((candidato) =>
      candidato.inscricoes.map((inscricao) => ({
        id: inscricao.id,
        nome: inscricao.curso,
        descricao: inscricao.descricao,
        status: inscricao.status,
        dataInscricao: inscricao.data_inscricao,
        candidatoNome: candidato.nome,
        candidatoId: candidato.id,
      }))
    );
  } catch (error) {
    console.error("Erro ao carregar inscrições:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
