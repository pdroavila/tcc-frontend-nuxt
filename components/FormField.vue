<template>
  <div>
    <label
      :for="id"
      v-if="!not_label"
      class="flex gap-2 text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }} <span v-if="required" class="text-red-500 mr-2">*</span>
      <div
        class="w-5 h-5 bg-green-200 flex align-middle justify-center rounded"
        v-if="tooltip"
      >
        <button
          type="button"
          class="text-gray-100 hover:text-gray-200 focus:outline-none"
          @click="openModal"
        >
          ?
        </button>
      </div>
    </label>
    <input
      v-if="type !== 'select' && type !== 'checkbox'"
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :aria-required="required"
      :placeholder="placeholder"
      :pattern="pattern"
      :title="title"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
    />
    <select
      v-else-if="type === 'select'"
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :aria-required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
    >
      <option value="" disabled selected>Selecione</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <div v-else-if="type === 'checkbox'" class="flex items-center">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        :required="required"
        :aria-required="required"
        class="h-4 w-4 text-green-100 focus:ring-green-500 border-gray-300 rounded"
      />
      <label :for="id" class="ml-2 block text-sm text-gray-900">{{
        label
      }}</label>
    </div>
    <InfoModal
      :is-open="isModalOpen"
      :title="label"
      :content="tooltip"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number, Boolean],
  type: {
    type: String,
    default: "text",
  },
  required: Boolean,
  options: Array,
  placeholder: String,
  not_label: Boolean,
  pattern: String,
  title: String,
  disabled: Boolean,
  tooltip: String,
});

const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

defineEmits(["update:modelValue"]);
</script>
