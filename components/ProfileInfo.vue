<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Gênero"
          v-model="formData.genero"
          type="select"
          :options="generoOptions"
          required
        />
        <FormField
          label="Portador de necessidades especiais?"
          v-model="formData.necessidadesEspeciais"
          type="select"
          :options="simNaoOptions"
          required
        />
        <FormField
          label="Estado Civil"
          v-model="formData.estadoCivil"
          type="select"
          :options="estadoCivilOptions"
          required
        />
        <FormField
          v-if="formData.necessidadesEspeciais === 'sim'"
          label="Se sim, quais?"
          placeholder="Descreva a necessidade especial"
          v-model="formData.quaisNecessidades"
        />
        <FormField
          label="Renda per capita"
          v-model="formData.rendaPerCapita"
          type="select"
          :options="rendaOptions"
          required
        />
        <FormField
          label="Etnia"
          v-model="formData.etnia"
          type="select"
          :options="etniaOptions"
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
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import FormField from "./FormField.vue";
import {
  generoOptions,
  simNaoOptions,
  estadoCivilOptions,
  rendaOptions,
  etniaOptions,
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
