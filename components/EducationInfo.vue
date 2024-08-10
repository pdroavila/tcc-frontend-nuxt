<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <FormField
            label="Estudou em escola pública ou privada?"
            v-model="formData.tipoEscola"
            type="select"
            :options="tipoEscolaOptions"
            required
          />
        </div>
        <div class="sm:col-span-2">
          <FormField
            label="Nível de escolaridade"
            v-model="formData.nivelEscolaridade"
            type="select"
            :options="escolaridadeOptions"
            required
          />
        </div>
        <div class="sm:col-span-2">
          <FileUpload
            label="Envie o histórico escolar"
            v-model="formData.historicoEscolar"
            accept="image/png, image/jpeg, image/jpg, .pdf"
            required
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
          {{ currentStep === 1 ? "PRÓXIMA SEÇÃO" : "FINALIZAR INSCRIÇÃO" }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import FormField from "./FormField.vue";
import FileUpload from "./FileUpload.vue";
import {
  tipoEscolaOptions,
  escolaridadeOptions,
} from "~/constants/formOptions";

defineProps({
  formData: Object,
  currentStep: Number,
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
