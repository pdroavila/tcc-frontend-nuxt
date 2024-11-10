<template>
  <div
    v-if="loading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
  >
    <Loader />
  </div>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Editar Curso</h1>
      </div>

      <form v-if="!loading" @submit.prevent="salvarCurso" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nome do Curso
          </label>
          <input
            v-model="formData.nome"
            type="text"
            maxlength="255"
            required
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            v-model="formData.descricao"
            rows="4"
            maxlength="255"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Pré-requisitos
          </label>
          <textarea
            v-model="formData.requisitos"
            rows="2"
            maxlength="255"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <div class="flex justify-around">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Prazo de Inscrições
            </label>
            <input
              v-model="formData.prazo_inscricoes"
              type="datetime-local"
              required
              class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Carga Horária
            </label>
            <input
              v-model="formData.carga_horaria"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Polos Ofertantes
          </label>

          <div class="flex items-center mb-4">
            <input
              type="checkbox"
              v-model="selectAll"
              @change="toggleSelectAll"
              class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label class="ml-2 text-sm text-gray-700">Todos</label>
          </div>

          <div class="space-y-2 grid grid-cols-5">
            <div v-for="polo in polos" :key="polo.id" class="flex items-center">
              <input
                type="checkbox"
                :value="polo.id"
                v-model="formData.polos"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label class="ml-2 text-sm text-gray-700">{{ polo.nome }}</label>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push('/admin/cursos')"
            class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-100 text-white rounded-md hover:bg-green-200 disabled:opacity-50"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPolos, updateCurso, fetchCurso } from "~/services/apiService";
import { useToast } from "vue-toastification";
const { verifyScreenAccess } = useAuth();

const toast = useToast();
const route = useRoute();
const router = useRouter();
const cursoId = route.params.id;
const config = useRuntimeConfig();

const loading = ref(true);
const polos = ref([]);
const formData = ref({
  nome: "",
  descricao: "",
  prazo_inscricoes: "",
  polos: [],
  carga_horaria: "",
  requisitos: "",
});

const selectAll = ref(false);

// Buscar dados do curso
const buscarCurso = async () => {
  try {
    const data = await fetchCurso(config, cursoId);

    // Formata a data para o formato aceito pelo input datetime-local
    const date = new Date(data.prazo_inscricoes);
    const formattedDate = date.toISOString().slice(0, 16);

    formData.value = {
      ...data,
      prazo_inscricoes: formattedDate,
    };
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    toast.error(error);
  }
};

const buscarPolos = async () => {
  try {
    const data = await getPolos(config);
    polos.value = data;
  } catch (error) {
    console.error("Erro ao buscar polos:", error);
  }
};

// Salvar curso
const salvarCurso = async () => {
  try {
    loading.value = true;
    const response = await updateCurso(cursoId, formData, config);
    toast.success(response.message);
    router.push("/admin/cursos/");
  } catch (error) {
    console.error("Erro ao salvar curso:", error);
  } finally {
    loading.value = false;
  }
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    formData.value.polos = polos.value.map((polo) => polo.id);
  } else {
    formData.value.polos = [];
  }
};

watch(
  () => formData.value.polos,
  (newVal) => {
    selectAll.value = newVal.length === polos.value.length;
  }
);

onMounted(async () => {
  try {
    loading.value = true;
    await Promise.all([buscarCurso(), buscarPolos()]);
    await verifyScreenAccess("/admin/cursos");
  } finally {
    loading.value = false;
  }
});
</script>
