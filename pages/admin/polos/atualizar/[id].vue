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
        <h1 class="text-2xl font-bold">Editar Polo</h1>
        <button
          @click="showDeleteDialog = true"
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Excluir Polo
        </button>
      </div>

      <form v-if="!loading" @submit.prevent="salvarPolo" class="space-y-6">
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
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>

  <Modal v-if="showDeleteDialog" @close="showDeleteDialog = false">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Confirmar Exclusão</h2>
    </template>

    <template #body>
      <p class="text-sm text-gray-500">
        Tem certeza que deseja excluir este polo? Esta ação não pode ser
        desfeita.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-4">
        <button
          @click="showDeleteDialog = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          @click="excluirPolo"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Excluir
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuth } from "@/composables/useAuth";
import {
  getCidades,
  updatePolo,
  getPolo,
  deletePolo,
} from "~/services/apiService";
import Modal from "~/components/Modal.vue";

const { verifyScreenAccess } = useAuth();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const poloId = route.params.id;
const config = useRuntimeConfig();

const loading = ref(true);
const cidades = ref([]);
const showDeleteDialog = ref(false);

const formData = ref({
  nome: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
});

const buscarPolo = async () => {
  try {
    formData.value = await getPolo(poloId, config);
  } catch (error) {
    console.error("Erro ao buscar polo:", error);
    toast.error("Erro ao buscar dados do polo");
  }
};

const buscarCidades = async () => {
  try {
    cidades.value = await getCidades(config);
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  }
};

const salvarPolo = async () => {
  try {
    loading.value = true;
    await updatePolo(poloId, formData, config);
    toast.success("Polo atualizado com sucesso!");
    router.push("/admin/polos/");
  } catch (error) {
    console.error("Erro ao atualizar polo:", error);
    toast.error("Erro ao atualizar polo");
  } finally {
    loading.value = false;
  }
};

const excluirPolo = async () => {
  try {
    loading.value = true;
    await deletePolo(poloId, config);
    toast.success("Polo excluído com sucesso!");
    router.push("/admin/polos/");
  } catch (error) {
    console.error("Erro ao excluir polo:", error);
    toast.error("Erro ao excluir polo");
  } finally {
    loading.value = false;
    showDeleteDialog.value = false;
  }
};

onMounted(async () => {
  try {
    await Promise.all([buscarPolo(), buscarCidades()]);
    await verifyScreenAccess("/admin/polos");
  } finally {
    loading.value = false;
  }
});
</script>
