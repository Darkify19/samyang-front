<template>
    <div class="layout">
        <HeaderComponent />

        <main>
            <MessageComponent ref="message" />
            <router-view />
        </main>

        <FooterComponent />
    </div>
</template>

<script>
import HeaderComponent from './HeaderComponent.vue';
import FooterComponent from './FooterComponent.vue';
import MessageComponent from './MessageComponent.vue';

export default {
    components: {
        HeaderComponent,
        FooterComponent,
        MessageComponent,
    },
};
</script>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;
    padding: 20px;
}
</style>
