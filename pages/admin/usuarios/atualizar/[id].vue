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
        <h1 class="text-2xl font-bold">
          {{ isNew ? "Novo Usuário" : "Editar Usuário" }}
        </h1>
      </div>

      <form @submit.prevent="salvarUsuario" class="space-y-6">
        <!-- Dados básicos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Username</label>
            <input
              v-model="formData.username"
              type="text"
              class="border rounded-md p-2"
              :disabled="!isNew"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="border rounded-md p-2"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Nome Completo</label>
            <input
              v-model="formData.nome_completo"
              type="text"
              class="border rounded-md p-2"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Senha</label>
            <input
              v-model="formData.password"
              type="password"
              class="border rounded-md p-2"
              :placeholder="
                isNew ? '' : 'Deixe em branco para manter a senha atual'
              "
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
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTelas, updateAdminUser, getDados } from "~/services/apiService";
const { verifyScreenAccess } = useAuth();

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const loading = ref(true);
const telas = ref([]);
const isNew = !route.params.id;

const formData = reactive({
  username: "",
  email: "",
  nome_completo: "",
  password: "",
  ativo: true,
  telas: [],
});

const carregarDados = async () => {
  try {
    loading.value = true;

    // Carregar telas disponíveis
    const telasData = await getTelas(config);
    telas.value = telasData;

    if (!isNew) {
      // Carregar dados do usuário se estiver editando
      const userData = await getDados(config, route.params.id);

      formData.username = userData.username;
      formData.email = userData.email;
      formData.nome_completo = userData.nome_completo;
      formData.ativo = userData.ativo;
      formData.telas = userData.telas.map((t) => t.id);
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  } finally {
    loading.value = false;
  }
};

const salvarUsuario = async () => {
  try {
    loading.value = true;

    const userData = {
      ...formData,
      // Só envia a senha se foi preenchida
      ...(formData.password && { password: formData.password }),
    };

    await updateAdminUser(route.params.id, userData, config);
    router.push("/admin/usuarios");
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
};

const voltar = () => {
  router.push("/admin/usuarios");
};

onMounted(async () => {
  await verifyScreenAccess("/admin/usuarios");
  carregarDados();
});
</script>
