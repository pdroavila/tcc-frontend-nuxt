<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <FormField
            label="Estudou em escola pública ou privada?"
            v-model="formData.tipo_escola"
            type="select"
            :options="tipoEscolaOptions"
            required
          />
        </div>
        <div class="sm:col-span-2">
          <FormField
            label="Nível de escolaridade"
            v-model="formData.nivel_escolaridade"
            type="select"
            :options="escolaridadeOptions"
            required
          />
        </div>
        <div class="sm:col-span-2">
          <FileUpload
            label="Envie o histórico escolar"
            v-model="formData.anexo_historico_escolar"
            accept="image/png, image/jpeg, image/jpg, .pdf"
            tipo="historico"
            :formData="formData"
            required
            :isClickable="hist_image"
            :url="hist_url"
          />
        </div>
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
          {{
            currentStep === 1
              ? "PRÓXIMA SEÇÃO"
              : alteracao
              ? "ALTERAR DADOS"
              : "FINALIZAR INSCRIÇÃO"
          }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, ref } from "vue";
import FormField from "./FormField.vue";
import FileUpload from "./FileUpload.vue";
import {
  tipoEscolaOptions,
  escolaridadeOptions,
} from "~/constants/formOptions";

const props = defineProps({
  formData: Object,
  currentStep: Number,
});

const isBase64 = (str) => {
  // Remover o prefixo se houver
  const base64PrefixPattern = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?;base64,/;
  if (base64PrefixPattern.test(str)) {
    str = str.replace(base64PrefixPattern, "");
  }

  // Verifica se a string não é vazia e segue o comprimento múltiplo de 4
  if (!str || str.trim() === "" || str.length % 4 !== 0) {
    return false;
  }

  // Utiliza uma expressão regular para validar o padrão do Base64
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

  return base64Regex.test(str);
};

const config = useRuntimeConfig();
const hist_image = ref(null);
const hist_url = ref("");
const alteracao = ref(props.formData.alteracao);

onMounted(() => {
  if (
    props.formData.anexo_historico_escolar &&
    !isBase64(props.formData.anexo_historico_escolar)
  ) {
    hist_image.value = true;
    hist_url.value = `${config.public.apiUrl}/media-image/${props.formData.anexo_historico_escolar}`;
  }
});

watchEffect(() => {
  if (
    props.formData.anexo_historico_escolar &&
    !isBase64(props.formData.anexo_historico_escolar)
  ) {
    hist_image.value = true;
    hist_url.value = `${config.public.apiUrl}/media-image/${props.formData.anexo_historico_escolar}`;
  } else {
    hist_image.value = false;
    hist_url.value = "";
  }
});

const emit = defineEmits(["next", "previous"]);
const handleSubmit = (event) => {
  if (event.target.checkValidity()) {
    emit("next");
  } else {
    event.target.reportValidity();
  }
};
</script>
