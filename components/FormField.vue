<template>
  <div>
    <label
      :for="id"
      v-if="!not_label"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
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
});

defineEmits(["update:modelValue"]);
</script>
