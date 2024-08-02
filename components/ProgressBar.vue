<template>
  <div
    class="flex flex-wrap mb-6 sm:mb-8 border-b overflow-x-auto justify-center gap-2.5"
  >
    <div
      v-for="(section, index) in sections"
      :key="index"
      class="flex items-center mr-4 sm:mr-8 pb-2 whitespace-nowrap"
      :class="{ 'border-b-2 border-green-100': currentSection === index }"
    >
      <div
        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-1 sm:mr-2 text-xs sm:text-sm"
        :class="
          currentSection === index
            ? 'bg-green-100 text-white'
            : 'bg-gray-300 text-gray-600'
        "
      >
        {{ index + 1 }}
      </div>
      <span
        class="text-xs sm:text-sm"
        :class="currentSection === index ? 'text-pedro' : 'text-gray-500'"
      >
        {{ section.title }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  sections: Array,
  currentSection: Number,
});
</script>
