<template>
  <header
    class="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-green-100 z-10 h-16"
  >
    <div class="container mx-auto flex justify-between items-center py-2 px-6">
      <div class="text-2xl font-bold text-gray-800">
        <img
          src="/images/logo_fic.png"
          alt="Logotipo"
          class="h-12 w-auto cursor-pointer"
          @click="navigateToForm()"
        />
      </div>
      <div
        v-if="authCandidato || isAuthenticated"
        class="font-bold text-green-100 hover:text-green-200 rounded-md flex gap-6"
      >
        <button @click="meus_cursos" v-if="!isAuthenticated">
          MEUS CURSOS
        </button>
        <button @click="dashboard" v-if="isAuthenticated">DASHBOARD</button>
        <button @click="polos" v-if="isAuthenticated && accessPole">
          POLOS
        </button>
        <button @click="cursos" v-if="isAuthenticated && accessCourse">
          CURSOS
        </button>
        <button @click="usuarios" v-if="isAuthenticated && accessUser">
          USUÁRIOS
        </button>
        <button @click="inscricoes" v-if="isAuthenticated && accessInscription">
          INSCRIÇÕES
        </button>
        <button @click="sair">SAIR</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const {
  isAuthenticated,
  authHash,
  checkAuthHash,
  logout,
  logoutAdmin,
  verifyHeaderAccess,
} = useAuth();

const accessPole = ref(false);
const accessCourse = ref(false);
const accessUser = ref(false);
const accessInscription = ref(false);

const authCandidato = computed(() => authHash.value !== null);
const router = useRouter();

const navigateToForm = () => {
  router.push(`/`);
};

const meus_cursos = () => {
  router.push(`/accesso/${authHash.value}`);
};

const dashboard = () => {
  router.push(`/admin/dashboard`);
};

const polos = () => {
  router.push(`/admin/polos/`);
};

const cursos = () => {
  router.push(`/admin/cursos/`);
};

const usuarios = () => {
  router.push(`/admin/usuarios/`);
};

const inscricoes = () => {
  router.push(`/admin/inscricoes/`);
};

const sair = () => {
  if (isAuthenticated.value) {
    logoutAdmin();
  } else {
    logout();
  }
  router.push(`/`);
};

watch(isAuthenticated, async (newValue) => {
  if (newValue) {
    const adminAccess = await verifyHeaderAccess("/admin/cursos");
    accessCourse.value = adminAccess;

    const usersAccess = await verifyHeaderAccess("/admin/usuarios");
    accessUser.value = usersAccess;

    const inscriptionAccess = await verifyHeaderAccess("/admin/inscricoes");
    accessInscription.value = inscriptionAccess;

    const polesAccess = await verifyHeaderAccess("/admin/polos");
    accessPole.value = polesAccess;
  }
});

onMounted(async () => {
  const adminAccess = await verifyHeaderAccess("/admin/cursos");
  accessCourse.value = adminAccess;

  const usersAccess = await verifyHeaderAccess("/admin/usuarios");
  accessUser.value = usersAccess;

  const inscriptionAccess = await verifyHeaderAccess("/admin/inscricoes");
  accessInscription.value = inscriptionAccess;

  const polesAccess = await verifyHeaderAccess("/admin/polos");
  accessPole.value = polesAccess;
});
</script>
