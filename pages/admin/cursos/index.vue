<template>
  <div
    v-if="loading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
  >
    <Loader />
  </div>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-6">Cursos</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Nome do Curso</label>
          <input
            v-model="filters.nome"
            type="text"
            class="border rounded-md p-2"
            placeholder="Filtrar por nome"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Polo</label>
          <select v-model="filters.polo" class="border rounded-md p-2">
            <option value="">Selecione um polo</option>
            <option v-for="polo in polos" :key="polo.id" :value="polo.id">
              {{ polo.nome }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Data Inicial</label>
          <input
            v-model="filters.dataInicial"
            type="date"
            class="border rounded-md p-2"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Data Final</label>
          <input
            v-model="filters.dataFinal"
            type="date"
            class="border rounded-md p-2"
          />
        </div>
      </div>

      <div class="flex justify-end mb-4 gap-1">
        <button
          @click="novoCurso"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Curso
        </button>

        <button
          @click="buscarCursos"
          class="px-4 py-2 bg-green-100 text-white rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Buscar
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nome
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Descrição
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prazo Inscrições
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Carga Horária
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="curso in cursos" :key="curso.id">
              <td class="px-6 py-4 whitespace-nowrap text-center">
                {{ curso.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                {{ curso.nome }}
              </td>
              <td class="px-6 py-4 text-center">{{ curso.descricao }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                {{ formatDate(curso.prazo_inscricoes) }}
              </td>
              <td class="px-6 py-4 text-center">{{ curso.carga_horaria }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button
                  @click="verDetalhes(curso.id)"
                  class="text-sm px-3 py-1 hover:bg-green-700 bg-green-100 text-white rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Ver Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getCursos, getPolos } from "~/services/apiService";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(true);
const cursos = ref([]);
const polos = ref([]);
const config = useRuntimeConfig();
const filters = reactive({
  nome: "",
  dataInicial: "",
  dataFinal: "",
  polo: "",
});
const { verifyScreenAccess } = useAuth();

// Função para buscar cursos
const buscarCursos = async () => {
  try {
    loading.value = true;
    const data = await getCursos(filters, config);
    cursos.value = data;
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
  } finally {
    loading.value = false;
  }
};

const novoCurso = async () => {
  router.push(`/admin/cursos/novo`);
};

// Função para formatar data
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

// Função para ver detalhes
const verDetalhes = (id) => {
  router.push(`/admin/cursos/atualizar/${id}`);
};

const buscarPolos = async () => {
  try {
    const data = await getPolos(config);
    polos.value = data;
  } catch (error) {
    console.error("Erro ao buscar polos:", error);
  }
};

onMounted(async () => {
  buscarCursos();
  buscarPolos();
  await verifyScreenAccess("/admin/cursos");
});
</script>
