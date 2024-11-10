<template>
  <div
    v-if="loading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
  >
    <Loader />
  </div>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-6">Cadastrar Novo Polo</h1>

      <form @submit.prevent="salvarPolo" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nome do Polo
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
            Logradouro
          </label>
          <input
            v-model="formData.logradouro"
            type="text"
            maxlength="255"
            required
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Número
            </label>
            <input
              v-model="formData.numero"
              type="number"
              required
              class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <input
              v-model="formData.bairro"
              type="text"
              maxlength="255"
              required
              class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <select
            v-model="formData.cidade"
            required
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione uma cidade</option>
            <option
              v-for="cidade in cidades"
              :key="cidade.id"
              :value="cidade.id"
            >
              {{ cidade.nome }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push('/admin/polos')"
            class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Salvar Polo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { getCidades, postPolos } from "~/services/apiService";
const { verifyScreenAccess } = useAuth();

const toast = useToast();
const router = useRouter();
const loading = ref(true);
const cidades = ref([]);
const config = useRuntimeConfig();

const formData = ref({
  nome: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
});

const buscarCidades = async () => {
  try {
    cidades.value = await getCidades(config);
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  } finally {
    loading.value = false;
  }
};

const salvarPolo = async () => {
  try {
    loading.value = true;
    const response = await postPolos(formData, config);
    toast.success("Polo cadastrado com sucesso!");
    router.push("/admin/polos/");
  } catch (error) {
    console.error("Erro ao salvar polo:", error);
    toast.error("Erro ao salvar polo");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await buscarCidades();
  await verifyScreenAccess("/admin/polos");
});
</script>
