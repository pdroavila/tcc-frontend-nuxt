<template>
    <Login />
</template>

<script setup>
import Loader from '~/components/Login.vue';
import { useAuth } from '~/composables/useAuth';
const { authHash, checkAuthHash, logout, redirectIfAuthenticated } = useAuth();

//Se estiver logado como candidato, irá deslogar;
onBeforeMount(() => {
    if(authHash){
        logout();
    }
})

onMounted( () => {
    redirectIfAuthenticated();
})
</script>