<template>
    <Graphic />
</template>


<script setup>
    import { useAuth } from '~/composables/useAuth';
    import Graphic from '~/components/Graphic.vue';
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