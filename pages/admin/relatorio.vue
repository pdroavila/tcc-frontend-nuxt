<template>
    relatorio
</template>

<script setup>
    import {useAuth} from "~/composables/useAuth"

    const {verifyScreenAccess} = useAuth();

    onMounted(async() => {
        const hasAccess = await verifyScreenAccess('/admin/relatorio');
        if (!hasAccess) {
            console.log('caraiooooo')
        }
    })
</script>