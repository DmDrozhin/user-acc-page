<script setup lang="ts">
  import mockProfile from './data/mockProfile.json';
  import mockCard from './data/mockProfileCard.json';
  // end of mock imports
  import { onMounted, reactive, ref } from 'vue';
  import LoaderModal from './components/LoaderModal.vue';
  import UserProfile from './components/UserProfile.vue';

  const incomingProfile = ref<Profile | null>(null);
  const incomingCard = ref<UserCard | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const outgoingProfile = ref<Profile | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const outgoingCard = ref<UserCard | null>(null);

  const isLoading = reactive<Record<string, boolean>>({
    userProfile: false,
    userCard: false
  });
  const saveProfileData = () => {
    if (mockProfile) {
      incomingProfile.value = mockProfile as Profile;
    }
  };
  const saveCardData = () => {
    if (mockCard) {
      incomingCard.value = mockCard as UserCard;
    }
  };
  onMounted(() => {
    // Simulate fetching profile data
    isLoading.userProfile = true;
    setTimeout(() => {
      saveProfileData();
      isLoading.userProfile = false;
    }, 500);
    // Simulate fetching card data
    isLoading.userCard = true;
    setTimeout(() => {
      saveCardData();
      isLoading.userCard = false;
    }, 1500);
  });
</script>

<template>
  <main class="user-profile-page">
    <LoaderModal v-if="isLoading.userProfile || isLoading.userCard" message="Loading user profile..." />
    <UserProfile
      v-if="incomingProfile && !isLoading.userProfile && !isLoading.userCard"
      :options="{ incomingProfile: incomingProfile, incomingCard: incomingCard, uuid: incomingProfile?.uuid }" />
  </main>
</template>

<style scoped lang="scss">
  .user-profile-page {
    min-height: 100vh;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.03);
  }
</style>
