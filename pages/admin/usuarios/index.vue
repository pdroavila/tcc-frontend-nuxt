<template>
  <div
    v-if="loading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
  >
    <Loader />
  </div>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-6">Usuários Administradores</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Nome do Usuário</label>
          <input
            v-model="filters.nome"
            type="text"
            class="border rounded-md p-2"
            placeholder="Filtrar por nome"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Email</label>
          <input
            v-model="filters.email"
            type="text"
            class="border rounded-md p-2"
            placeholder="Filtrar por email"
          />
        </div>
      </div>

      <div class="flex justify-end mb-4 gap-1">
        <button
          @click="novoAdmin"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Administrador
        </button>

        <button
          @click="buscarAdmins"
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
                Usuário
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nome Completo
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="admin in admins" :key="admin.id">
              <td class="px-6 py-4 whitespace-nowrap text-center">
                {{ admin.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                {{ admin.username }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                {{ admin.nome_completo }}
              </td>
              <td class="px-6 py-4 text-center">{{ admin.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span>
                  {{ admin.ativo ? "Ativo" : "Inativo" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button
                  @click="verDetalhes(admin.id)"
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAdminUsers } from "~/services/apiService";
const { verifyScreenAccess } = useAuth();

const router = useRouter();
const loading = ref(true);
const admins = ref([]);
const config = useRuntimeConfig();

const filters = reactive({
  nome: "",
  email: "",
});

const buscarAdmins = async () => {
  try {
    loading.value = true;
    const data = await getAdminUsers(filters, config);
    admins.value = data;
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
  } finally {
    loading.value = false;
  }
};

const novoAdmin = () => {
  router.push("/admin/usuarios/novo");
};

const verDetalhes = (id) => {
  router.push(`/admin/usuarios/atualizar/${id}`);
};

onMounted(async () => {
  buscarAdmins();
  await verifyScreenAccess("/admin/usuarios");
});
</script>
