<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75"
  >
    <div
      class="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl relative mx-4 h-full"
    >
      <div class="flex justify-end">
        <button
          @click="$emit('close')"
          class="top-4 right-4 text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center w-4"
        >
          <span class="sr-only">Fechar</span>
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="mb-4">
        <slot name="header"></slot>
      </div>
      <slot name="body"></slot>
      <div class="mt-4 flex justify-end gap-2">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  emits: ["close"],
};
</script>
