<script setup lang="ts">
  // mock imports
  import mockCards from './data/mockCards.json';
  import mockProfile from './data/mockProfile.json';
  // end of mock imports
  import { onMounted, reactive, ref } from 'vue';
  import LoaderModal from './components/LoaderModal.vue';
  import UserProfile from './components/UserProfile.vue';

  const incomingProfile = ref<Profile | null>(null);
  const incomingCard = ref<UserCard | null>(null);

  const saveProfile = (profile: Profile) => {
    const { userCard, ...rest } = profile;

    incomingProfile.value = { ...rest };
    incomingCard.value = userCard || null;
    // For demo purposes, just log to console
    console.log(incomingProfile.value, incomingCard.value);
  };

  const isLoading = reactive<Record<string, boolean>>({
    userProfile: false,
    userCard: false
  });
  const saveProfileData = () => {
    if (mockProfile) {
      incomingProfile.value = mockProfile as Profile;
    }
  };
  const randomCard = (): UserCard => {
    const cards = [...Object.values(mockCards)];
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex] as UserCard;
  };
  const saveCardData = () => {
    const card = randomCard();
    if (card) {
      incomingCard.value = card;
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
      :options="{ incomingProfile: { ...incomingProfile, uuid: incomingProfile.uuid }, incomingCard: incomingCard }"
      @save:profile="saveProfile" />
  </main>
</template>

<style scoped lang="scss">
  .user-profile-page {
    min-height: 100vh;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.03);
  }
</style>
