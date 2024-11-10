<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <FormField
          label="Você mora em área urbana ou rural?"
          v-model="formData.area"
          type="select"
          :options="areaOptions"
          required
        />
      </div>
      <div class="sm:col-span-2">
        <FormField
          label="CEP"
          v-model="formData.cep"
          placeholder="Sem pontos e/ou traços"
          pattern="^\d{8}$"
          title="O campo deve conter apenas números, sem pontos."
          @input="handleCEPInput"
          required
        />
      </div>
      <FormField
        label="Estado"
        v-model="formData.estado"
        type="select"
        :options="estadoOptions"
        required
      />
      <FormField
        label="Cidade"
        v-model="formData.cidade"
        type="select"
        :options="cidadeOptions"
        required
      />
      <div>
        <FormField
          label="Logradouro"
          v-model="formData.logradouro"
          placeholder="Logradouro"
          required
        />
      </div>
      <FormField
        label="Número"
        v-model="formData.numero"
        pattern="\d+"
        title="Deve conter apenas números"
        placeholder="Número da residência"
        required
      />
      <FormField
        placeholder="Bairro"
        label="Bairro"
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        v-model="formData.bairro"
        required
      />
      <FormField
        label="Complemento"
        placeholder="Complemento"
        v-model="formData.complemento"
        required
      />
    </div>
    <div class="flex justify-between mt-6">
      <button
        type="button"
        @click="$emit('previous')"
        class="px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        VOLTAR
      </button>
      <div></div>
      <button
        type="submit"
        class="px-4 sm:px-6 py-2 bg-green-100 text-white rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {{ currentStep === 1 ? "PRÓXIMA SEÇÃO" : "CONTINUAR" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
import FormField from "./FormField.vue";
import { maskCEP } from "~/utils/masks";
import { fetchEstados, fetchCidades, getCEP } from "~/services/apiService";

const props = defineProps({
  formData: Object,
  currentStep: Number,
});

const emit = defineEmits(["next", "previous"]);

const areaOptions = ref([
  { value: 0, label: "Urbana" },
  { value: 1, label: "Rural" },
]);

const estadoOptions = ref([]);
const cidadeOptions = ref([]);

const handleCEPInput = async (event) => {
  const cep = event.target.value.replace(/\D/g, "");
  if (cep.length === 8) {
    try {
      const data = await getCEP(cep);
      props.formData.logradouro = data.logradouro;
      props.formData.bairro = data.bairro;
      props.formData.estado = data.uf;
      cidadeOptions.value = await fetchCidades(data.uf);
      props.formData.cidade = data.localidade;
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  }
  maskCEP(event);
};

watch(
  () => props.formData.estado,
  async (newValue) => {
    cidadeOptions.value = await fetchCidades(newValue);
  }
);

onMounted(async () => {
  if (props.formData.cep) {
    let cep = props.formData.cep;

    if (cep.length === 8) {
      try {
        const data = await getCEP(cep);

        if (data.logradouro) props.formData.logradouro = data.logradouro;

        if (data.bairro) props.formData.bairro = data.bairro;

        if (data.uf)
          props.formData.estado = data.uf ? data.uf : props.formData.estado;

        cidadeOptions.value = await fetchCidades(data.uf);
        props.formData.cidade = data.localidade;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  }
});

const handleSubmit = (event) => {
  if (event.target.checkValidity()) {
    emit("next");
  } else {
    event.target.reportValidity();
  }
};

onMounted(async () => {
  try {
    estadoOptions.value = await fetchEstados();
  } catch (error) {
    console.error("Erro ao carregar estados:", error);
  }
});
</script>
