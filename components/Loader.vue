<template>
  <div class="loader-dots">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style scoped>
.loader-dots {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-dots div {
  width: 12px;
  height: 12px;
  margin: 0 4px;
  background: #48bb78;
  border-radius: 50%;
  animation: loader-dots 0.8s infinite ease-in-out both;
}

.loader-dots div:nth-child(1) {
  animation-delay: -0.32s;
}

.loader-dots div:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loader-dots {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
