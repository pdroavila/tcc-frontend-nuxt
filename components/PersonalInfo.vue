<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="currentStep === 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Campos existentes permanecem os mesmos -->
      <FormField
        label="E-mail"
        v-model="formData.email"
        type="email"
        placeholder="Digite seu e-mail"
        required
      />
      <FormField
        label="Nacionalidade"
        v-model="formData.nacionalidade"
        type="select"
        :options="countries"
        required
        :loading="loadingCountries"
        :error="countriesError"
      />
      <FormField
        label="Nome"
        v-model="formData.nome_completo"
        required
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        placeholder="Nome completo"
      />
      <div class="relative">
        <FormField
          label="Naturalidade"
          v-model="formData.naturalidade_nome"
          placeholder="Município de nascimento"
          pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
          title="Deve conter apenas letras"
          naturalidade
          required
        />
        <!-- Dropdown de sugestões -->
        <ul v-if="suggestions.length > 0" class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto w-full">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            class="cursor-pointer p-2 hover:bg-gray-100"
          >
            {{ suggestion.nome }}
          </li>
        </ul>
      </div>
      <FormField
        label="Nome social"
        v-model="formData.nome_social"
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        placeholder="Nome completo"
        tooltip="Nome social é o nome pelo qual você prefere ser chamado(a), podendo diferir do nome em seus documentos oficiais. Se aplicável, digite seu nome social completo."
      />
      <FormField
        label="Telefone celular"
        v-model="formData.telefone_celular"
        placeholder="DDD + 9 números"
        type="tel"
        pattern="^(\d{2}\s9\d{8}|\d{2}9\d{8})$"
        title="Deve seguir o formato DDD + 9 Números"
        required
      />
      <FormField
        label="Nome da mãe"
        v-model="formData.nome_mae"
        required
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        placeholder="Nome completo"
      />
      <FormField
        label="Data de nascimento"
        v-model="formData.data_nascimento"
        type="date"
        required
        @input="validateDataNascimento"
      />
      <span v-if="errorDataNascimento" class="text-red-500 text-sm">
        {{ errorDataNascimento }}
      </span>
      <div class="sm:col-span-2">
        <FormField
          label="Polo ofertante"
          v-model="formData.polo_ofertante"
          type="select"
          :options="poloOptions"
          required
        />
      </div>
    </div>
    <div
      v-else-if="currentStep === 1"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div class="flex flex-col gap-2">
        <FormField
          label="Número de documento (CPF ou Cédula Estrangeira)"
          v-model="formData.cpf"
          @input="validateDocumento"
          placeholder="Sem pontos e/ou traços"
          :class="{
            invalid: !documentoValido && !formData.cpf_cedula_estrangeira,
          }"
          required
        />
        <FormField
          label="Cédula Estrangeira"
          v-model="formData.cpf_cedula_estrangeira"
          type="checkbox"
          not_label
          @change="validateDocumento"
        />
        <span
          v-if="!documentoValido && !formData.cpf_cedula_estrangeira"
          class="text-red-500 text-sm"
          >CPF inválido</span
        >
      </div>
      <div class="flex flex-col gap-2">
        <FormField
          label="Registro Geral (RG ou Cédula Estrangeira)"
          v-model="formData.registro_geral"
          placeholder="Sem pontos e/ou traços"
          required
        />
        <FormField
          label="Cédula Estrangeira"
          v-model="formData.rg_cedula_estrangeira"
          type="checkbox"
          not_label
        />
      </div>
      <FileUpload
        label="Envie o documento"
        v-model="formData.anexo_cpf"
        accept="image/png, image/jpeg, image/jpg, .pdf"
        :formData="formData"
        tipo="cpf"
        required
      />
      <FileUpload
        label="Envie o RG"
        v-model="formData.anexo_rg"
        accept="image/png, image/jpeg, image/jpg, .pdf"
        :formData="formData"
        tipo="rg"
        required
      />
    </div>
    <div class="flex justify-between mt-6">
      <button
        v-if="currentStep > 0"
        type="button"
        @click="$emit('previous')"
        class="px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        VOLTAR
      </button>
      <div v-else></div>
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
import { ref, onMounted, watch } from "vue";
import FormField from "./FormField.vue";
import FileUpload from "./FileUpload.vue";
import { maskTelefone } from "~/utils/masks";
import { fetchCountries, fetchPolos } from "~/services/apiService";

const route = useRoute();
const props = defineProps({
  formData: Object,
  currentStep: Number,
});

const emit = defineEmits(["next", "previous"]);

const countries = ref([]);
const loadingCountries = ref(false);
const countriesError = ref("");
const documentoValido = ref(true);
const errorDataNascimento = ref("");
const poloOptions = ref([]);

onMounted(async () => {
  try {
    loadingCountries.value = true;
    countries.value = await fetchCountries();
    poloOptions.value = await fetchPolos(route.params.id);
  } catch (error) {
    countriesError.value =
      "Erro ao carregar países. Por favor, tente novamente.";
  } finally {
    loadingCountries.value = false;
  }
});

const validateDataNascimento = () => {
  const dataNascimento = new Date(props.formData.data_nascimento);
  const dezoitoAnosAtras = new Date();
  dezoitoAnosAtras.setFullYear(dezoitoAnosAtras.getFullYear() - 18);

  if (dataNascimento > dezoitoAnosAtras) {
    errorDataNascimento.value =
      "Você deve ter pelo menos 18 anos para fazer a inscrição.";
  } else {
    errorDataNascimento.value = "";
  }
};

const validateDocumento = () => {
  if (props.formData.cpf_cedula_estrangeira) {
    documentoValido.value = true;
    return;
  }

  const cpf = props.formData.cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
    documentoValido.value = false;
    return;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.substring(9, 10))) {
    documentoValido.value = false;
    return;
  }

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.substring(10, 11))) {
    documentoValido.value = false;
    return;
  }

  documentoValido.value = true;
};

const maskCPF = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  props.formData.cpf = value;
};

const handleSubmit = (event) => {
  if (
    event.target.checkValidity() &&
    (documentoValido.value || props.formData.cpf_cedula_estrangeira) &&
    !errorDataNascimento.value
  ) {
    emit("next");
  } else {
    event.target.reportValidity();
  }
};




// Função para buscar cidades pela API
const suggestions = ref([]);
let isSelecting = false;

const fetchCities = async (cityName) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/buscar-cidades?nome=${cityName}`);
    if (response.ok) {
      const data = await response.json();
      suggestions.value = data;
    }
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  }
};


// Função para selecionar uma sugestão de cidade e atualizar o formData
const selectSuggestion = (suggestion) => {
  isSelecting = true;  // Evita chamadas desnecessárias durante a seleção
  props.formData.naturalidade_nome = suggestion.nome;
  props.formData.naturalidade = suggestion.id;  // Armazena o ID da cidade, se necessário
  suggestions.value = [];  // Limpa as sugestões após a seleção
  setTimeout(() => {
    isSelecting = false;
  }, 100);
};

watch(() => props.formData.cpf_cedula_estrangeira, validateDocumento);
watch(() => props.formData.data_nascimento, validateDataNascimento);
// Watcher para monitorar mudanças no campo de naturalidade e buscar cidades
watch(
  () => props.formData.naturalidade_nome,
  (newVal) => {
    if (!isSelecting && newVal.length >= 3) {
      fetchCities(newVal);
    } else {
      suggestions.value = [];
    }
  }
);
</script>

<style scoped>
.invalid {
  border-color: red;
}
</style>
