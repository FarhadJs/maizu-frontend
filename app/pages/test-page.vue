<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ofetch } from 'ofetch';

const backendMessage = ref('Loading...');
const error = ref('');

onMounted(async () => {
    try {
        const response = await ofetch('http://localhost:3001/test/message');
        backendMessage.value = response; // ofetch خودش JSON را parse می‌کند
    } catch (err) {
        console.error('Error fetching from backend:', err);
        error.value = 'Failed to fetch message from backend.';
        backendMessage.value = 'Backend connection error!';
    }
});
</script>

<template>
    <v-container>
        <v-card class="mt-5 pa-3">
            <v-card-title class="text-h5">تست ارتباط با بک‌اند</v-card-title>
            <v-card-text>
                <p class="text-subtitle-1">پیام از Nest.js Backend:</p>
                <p class="text-body-1 font-weight-bold">{{ backendMessage }}</p>
                <p v-if="error" class="text-red-500">{{ error }}</p>
            </v-card-text>
        </v-card>
    </v-container>
</template>