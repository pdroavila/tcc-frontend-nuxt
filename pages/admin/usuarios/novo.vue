<template>
  <div
    v-if="loading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
  >
    <Loader />
  </div>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Novo Usuário Administrador</h1>
      </div>

      <form @submit.prevent="criarUsuario" class="space-y-6">
        <!-- Dados básicos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Username*</label>
            <input
              v-model="formData.username"
              type="text"
              class="border rounded-md p-2"
              required
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Email*</label>
            <input
              v-model="formData.email"
              type="email"
              class="border rounded-md p-2"
              required
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Nome Completo*</label>
            <input
              v-model="formData.nome_completo"
              type="text"
              class="border rounded-md p-2"
              required
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Senha*</label>
            <input
              v-model="formData.password"
              type="password"
              class="border rounded-md p-2"
              required
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="formData.ativo"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label class="ml-2 text-sm text-gray-600">Usuário Ativo</label>
          </div>
        </div>

        <!-- Módulos de Acesso -->
        <div class="mt-8">
          <h2 class="text-lg font-semibold mb-4">Módulos de Acesso</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="tela in telas"
              :key="tela.id"
              class="flex items-center p-4 border rounded-md"
            >
              <input
                type="checkbox"
                :value="tela.id"
                v-model="formData.telas"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <div class="ml-3">
                <p class="font-medium">{{ tela.nome }}</p>
                <p class="text-sm text-gray-500">{{ tela.descricao }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button
            @click="voltar"
            class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-green-100 text-white rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Criar Usuário
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getTelas, createAdminUser } from "~/services/apiService";
const { verifyScreenAccess } = useAuth();

const router = useRouter();
const config = useRuntimeConfig();
const loading = ref(true);
const telas = ref([]);

const formData = reactive({
  username: "",
  email: "",
  nome_completo: "",
  password: "",
  ativo: true,
  telas: [],
});

const carregarTelas = async () => {
  try {
    loading.value = true;
    const telasData = await getTelas(config);
    telas.value = telasData;
  } catch (error) {
    console.error("Erro ao carregar telas:", error);
  } finally {
    loading.value = false;
  }
};

const criarUsuario = async () => {
  try {
    loading.value = true;
    await createAdminUser(formData, config);
    router.push("/admin/usuarios");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  } finally {
    loading.value = false;
  }
};

const voltar = () => {
  router.push("/admin/usuarios");
};

onMounted(async () => {
  await verifyScreenAccess("/admin/usuarios");
  carregarTelas();
});
</script>
