<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import FromUserName from '@/components/FormUserName.vue';
  import { ACCOUNT_PAGE_HEADER } from '@/data/designations';

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
  <div class="profile">
    <div class="header-block">
      <img class="title-icon" :src="ACCOUNT_PAGE_HEADER.iconStatic" alt="User Icon" />
      <div class="header-block__wrapper">
        <div class="header-block__title">{{ ACCOUNT_PAGE_HEADER.title }}</div>
        <div class="header-block__subtitle">{{ ACCOUNT_PAGE_HEADER.subtitle }}</div>
      </div>
    </div>
  </div>
  <div class="profile__wrapper">
    <FromUserName />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;

  .profile {
    &__wrapper {
      position: relative;
      padding: 2rem 1.5rem;
      margin: 0 auto;
      background-color: $surface;
      border-radius: $radius-md;
      box-shadow: $shadow-md;
    }
  }
  .header-block {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem 1.5rem;
    margin-bottom: 2rem;
    background-color: $surface;
    border-radius: $radius-md;
    box-shadow: $shadow-md;
    &__wrapper {
    }
    &__title {
      font-size: 1.5rem;
      font-weight: 600;
    }
    &__subtitle {
      font-size: 1rem;
      color: gray;
    }
  }
</style>

<style lang="scss"></style>
