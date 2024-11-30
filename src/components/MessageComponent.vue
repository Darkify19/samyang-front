<template>
    <div v-if="visible" :class="['message', type, { visible }]">
        {{ text }}
    </div>
</template>


<script>
import { EventBus } from '@/eventBus';

export default {
    data() {
        return {
            visible: false,
            text: '',
            type: '',
        };
    },
    created() {
        EventBus.$on('message', this.setMessage);
    },
    methods: {
        setMessage({ type, text }) {
            this.type = type;
            this.text = text;
            this.visible = true;
            setTimeout(() => (this.visible = false), 5000);
        },
    },
};

</script>

<style scoped>
.message {
    position: fixed;
    top: 20px;
    margin-top: 70px;
    /* Adjust for spacing from the top */
    left: 20px;
    /* Adjust for spacing from the left */
    padding: 15px 20px;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 0;
    transform: translateY(-20px);
    z-index: 1000;
}

.message.visible {
    opacity: 1;
    transform: translateY(0);
}

.message.success {
    background-color: #F7D6D0;
    color: #821d30;
}

.message.error {
    background-color: #721c24;
    color: #f8d7da;

}
</style>
