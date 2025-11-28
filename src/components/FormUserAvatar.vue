<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import ImageUploader from '@/components/ImageUploader.vue';

interface Props {
  options?: Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({})
});

const defaultOptions: Record<string, unknown> = {};
const mainOptions = computed(() => ({
  ...props.options,
  ...defaultOptions
}));
</script>

<template>
  <div class="block">
    <ImageUploader />
  </div>
</template>

<style lang="scss" scoped>
.block {
  outline: 1px solid greenyellow;
  width: 100px;
  min-height: 50px;
}
</style>

<style lang="scss">
</style>
