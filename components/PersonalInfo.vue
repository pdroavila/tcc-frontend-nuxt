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
        v-model="formData.nome"
        required
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        placeholder="Nome completo"
      />
      <FormField
        label="Naturalidade"
        v-model="formData.naturalidade"
        placeholder="Município de nascimento"
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        required
      />
      <FormField
        label="Nome social"
        v-model="formData.nomeSocial"
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        placeholder="Nome completo"
        tooltip="Nome social é o nome pelo qual você prefere ser chamado(a), podendo diferir do nome em seus documentos oficiais. Se aplicável, digite seu nome social completo."
      />
      <FormField
        label="Telefone celular"
        v-model="formData.telefone"
        placeholder="DDD + 9 números"
        type="tel"
        pattern="^(\d{2}\s9\d{8}|\d{2}9\d{8})$"
        title="Deve seguir o formato DDD + 9 Números"
        required
      />
      <FormField
        label="Nome da mãe"
        v-model="formData.nomeMae"
        required
        pattern="[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
        title="Deve conter apenas letras"
        placeholder="Nome completo"
      />
      <FormField
        label="Data de nascimento"
        v-model="formData.dataNascimento"
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
          v-model="formData.poloOfertante"
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
          v-model="formData.documento"
          @input="validateDocumento"
          placeholder="Sem pontos e/ou traços"
          :class="{
            invalid: !documentoValido && !formData.isCedulaEstrangeira,
          }"
          required
        />
        <FormField
          label="Cédula Estrangeira"
          v-model="formData.isCedulaEstrangeira"
          type="checkbox"
          not_label
          @change="validateDocumento"
        />
        <span
          v-if="!documentoValido && !formData.isCedulaEstrangeira"
          class="text-red-500 text-sm"
          >CPF inválido</span
        >
      </div>
      <div class="flex flex-col gap-2">
        <FormField
          label="Registro Geral (RG ou Cédula Estrangeira)"
          v-model="formData.registroGeral"
          placeholder="Sem pontos e/ou traços"
          required
        />
        <FormField
          label="Cédula Estrangeira"
          v-model="formData.isRGCedulaEstrangeira"
          type="checkbox"
          not_label
        />
      </div>
      <FileUpload
        label="Envie o documento"
        v-model="formData.documentoUpload"
        accept="image/png, image/jpeg, image/jpg, .pdf"
        required
      />
      <FileUpload
        label="Envie o RG"
        v-model="formData.rgUpload"
        accept="image/png, image/jpeg, image/jpg, .pdf"
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
import { poloOptions } from "~/constants/formOptions";
import { fetchCountries } from "~/services/apiService";

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

const validateDataNascimento = () => {
  const dataNascimento = new Date(props.formData.dataNascimento);
  const dezoitoAnosAtras = new Date();
  dezoitoAnosAtras.setFullYear(dezoitoAnosAtras.getFullYear() - 18);

  if (dataNascimento > dezoitoAnosAtras) {
    errorDataNascimento.value =
      "Você deve ter pelo menos 18 anos para se registrar.";
  } else {
    errorDataNascimento.value = "";
  }
};

onMounted(async () => {
  try {
    loadingCountries.value = true;
    countries.value = await fetchCountries();
  } catch (error) {
    countriesError.value =
      "Erro ao carregar países. Por favor, tente novamente.";
  } finally {
    loadingCountries.value = false;
  }
});

const validateDocumento = () => {
  if (props.formData.isCedulaEstrangeira) {
    documentoValido.value = true;
    return;
  }

  const cpf = props.formData.documento.replace(/\D/g, "");
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
  props.formData.documento = value;
};

const handleSubmit = (event) => {
  if (
    event.target.checkValidity() &&
    (documentoValido.value || props.formData.isCedulaEstrangeira) &&
    !errorDataNascimento.value
  ) {
    emit("next");
  } else {
    event.target.reportValidity();
  }
};

watch(() => props.formData.isCedulaEstrangeira, validateDocumento);
watch(() => props.formData.dataNascimento, validateDataNascimento);
</script>

<style scoped>
.invalid {
  border-color: red;
}
</style>
