<template>
  <div>
    <div v-if="currentStep === 0">
      <FormField
        label="E-mail"
        v-model="formData.email"
        type="email"
        required
      />
      <FormField
        label="Nacionalidade"
        v-model="formData.nacionalidade"
        type="select"
        :options="nacionalidadeOptions"
        required
      />
      <!-- Other fields for step 0 -->
    </div>
    <div v-else-if="currentStep === 1">
      <FormField
        label="Número de documento"
        v-model="formData.documento"
        @input="maskCPF"
        required
      />
      <FormField
        label="Cédula Estrangeira"
        v-model="formData.isCedulaEstrangeira"
        type="checkbox"
      />
      <!-- Other fields for step 1 -->
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import FormField from "./FormField.vue";
import { maskCPF } from "~/utils/masks";
import { nacionalidadeOptions } from "~/constants/formOptions";

const props = defineProps({
  formData: Object,
  currentStep: Number,
});
</script>
