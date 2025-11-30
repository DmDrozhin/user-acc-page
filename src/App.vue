<script setup lang="ts">
  import UserAccount from './components/UserAccount.vue';
</script>

<template>
  <main class="user-profile-page">
    <UserAccount />
  </main>
</template>

<style scoped lang="scss">
  .user-profile-page {
    min-height: 100vh;
    padding: 2rem 1rem;
    background-color: rgba(0, 0, 0, 0.03);
  }
  @media (min-width: 1024px) {
  }
</style>
