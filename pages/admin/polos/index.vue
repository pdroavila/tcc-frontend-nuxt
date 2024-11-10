<template>
  <div
    v-if="loading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
  >
    <Loader />
  </div>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-6">Polos</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Nome do Polo</label>
          <input
            v-model="filters.nome"
            type="text"
            class="border rounded-md p-2"
            placeholder="Filtrar por nome"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Cidade</label>
          <select v-model="filters.cidade" class="border rounded-md p-2">
            <option value="">Todas as cidades</option>
            <option
              v-for="cidade in cidades"
              :key="cidade.id"
              :value="cidade.id"
            >
              {{ cidade.nome }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end mb-4 gap-1">
        <button
          @click="novoPolo"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Polo
        </button>

        <button
          @click="buscarPolos"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Buscar
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nome
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Endereço
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cidade
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="polo in polos" :key="polo.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ polo.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ polo.nome }}</td>
              <td class="px-6 py-4">
                {{ `${polo.logradouro}, ${polo.numero} - ${polo.bairro}` }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ polo.cidade_nome }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button
                  @click="verDetalhes(polo.id)"
                  class="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getPolos, getCidades } from "~/services/apiService";

const router = useRouter();
const loading = ref(true);
const polos = ref([]);
const cidades = ref([]);
const config = useRuntimeConfig();
const { verifyScreenAccess } = useAuth();

const filters = reactive({
  nome: "",
  cidade: "",
});

const buscarPolos = async () => {
  try {
    loading.value = true;
    polos.value = await getPolos(config, filters);
  } catch (error) {
    console.error("Erro ao buscar polos:", error);
  } finally {
    loading.value = false;
  }
};

const buscarCidades = async () => {
  try {
    cidades.value = await getCidades(config);
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  }
};

const novoPolo = () => {
  router.push("/admin/polos/novo");
};

const verDetalhes = (id) => {
  router.push(`/admin/polos/atualizar/${id}`);
};

onMounted(async () => {
  await Promise.all([buscarPolos(), buscarCidades()]);
  await verifyScreenAccess("/admin/polos");
});
</script>
