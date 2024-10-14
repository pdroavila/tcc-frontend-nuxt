<template>
  <div class="mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div
      class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
      @dragover.prevent="dragover"
      @dragleave="dragleave"
      @drop.prevent="drop"
      :class="{
        'border-indigo-500': isDragging,
        'border-green-500': fileUploaded,
      }"
    >
      <div class="space-y-1 text-center">
          <a v-if="isClickable" :href="url" target="_blank" rel="noopener noreferrer">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 cursor-pointer hover:text-gray-600"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>

        <svg
          v-else
          class="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="flex flex-col text-sm text-gray-600">
          <label
            :for="id"
            class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <span>Clique para selecionar o arquivo</span>
            <input
              :id="id"
              name="file-upload"
              type="file"
              class="sr-only"
              :accept="accept"
              @change="handleFileUpload($event, tipo)"
              :required="required && !fileUploaded"
            />
          </label>
          <p class="pl-1">ou arraste e solte</p>
        </div>
        <p class="text-xs text-gray-500">
          {{ accept.split(",").join(", ") }} até 10MB
        </p>
      </div>
    </div>
    <p v-if="fileName" class="mt-2 text-sm text-gray-500 break-words">
      Arquivo selecionado: {{ fileName }}
    </p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  id: String,
  label: String,
  modelValue: [File, null],
  required: Boolean,
  accept: String,
  tipo: String,
  formData: [Object, null],
  isClickable: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: '', // Pode ser definido como uma URL específica
  },
});

const emit = defineEmits(["update:modelValue"]);

const fileName = ref("");
const isDragging = ref(false);
const fileUploaded = ref(false);
const isClickable = ref(props.isClickable);

watch(
  () => props.modelValue,
  (newValue) => {
    fileUploaded.value = !!newValue;
  },
  { immediate: true }
);

onMounted(() => {
  if(props.formData.alteracao)
    fileUploaded.value = isClickable.value;
})

const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  processFile(file, type); // Passa o tipo de arquivo (cpf ou rg) para o processFile
};

const processFile = (file, type) => {
  if (file) {
    if (file.size <= 10 * 1024 * 1024) { // Limite de 10MB para o arquivo
      fileName.value = file.name;
      fileUploaded.value = true;
      
      const reader = new FileReader();
      
      // Ler o arquivo como Data URL (base64)
      reader.onloadend = () => {
        const base64String = reader.result;

        // Verifica o tipo de arquivo e coloca no campo correto
        if (type === 'cpf') {
          props.formData.anexo_cpf = base64String;  // Atribui a base64 no campo anexo_cpf
        } else if (type === 'rg') {
          props.formData.anexo_rg = base64String;   // Atribui a base64 no campo anexo_rg
        }

        isClickable.value = false;
        emit("update:modelValue", base64String);
      };
      
      reader.readAsDataURL(file); // Inicia a leitura do arquivo
    } else {
      alert("O arquivo é muito grande. O tamanho máximo permitido é 10MB.");
    }
  }
};

const dragover = (event) => {
  isDragging.value = true;
};

const dragleave = (event) => {
  isDragging.value = false;
};

const drop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  processFile(file);
};
</script>
