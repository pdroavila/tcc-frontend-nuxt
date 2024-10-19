<template>
    teste
</template>


<script setup>
    import { useAuth } from '~/composables/useAuth';
    const { authHash, checkAuthHash, logout, protectRoute } = useAuth();

    onBeforeMount(() => {
    if(authHash){
            logout();
        }
        protectRoute();

    })

    onMounted(() => {
        protectRoute();
    })
</script>