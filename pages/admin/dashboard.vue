<template>
    <Graphic />
</template>


<script setup>
    import { useAuth } from '~/composables/useAuth';
    import Graphic from '~/components/Graphic.vue';
    import Header from '~/components/Header.vue';

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