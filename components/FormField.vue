<template>
  <div>
    <label
      :for="id"
      v-if="!not_label"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }} <span v-if="required" class="text-red-500 mr-2">*</span>
      <span v-if="tooltip" class="relative inline-block ml-1 group">
        <span
          class="relative cursor-help text-gray-900 hover:text-gray-700 flex items-center justify-center w-4 h-4 bg-gray-900 text-white rounded-full"
        >
          ?
          <div
            class="absolute z-10 w-64 px-4 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible -top-10 left-1/2 transform -translate-x-1/2"
          >
            {{ tooltip }}
          </div>
        </span>
      </span>
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

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
.group:hover .group-hover\:visible {
  visibility: visible;
}
</style>
