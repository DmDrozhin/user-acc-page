<script setup lang="ts">
  import { onMounted, reactive, ref, computed } from 'vue';
  import LoaderModal from './components/LoaderModal.vue';
  import UserProfile from './components/UserProfile.vue';

  // mocks
  import mockCards from './data/mockCards.json';
  import mockProfile from './data/mockProfile.json';

  const incomingProfile = ref<Profile | null>(null);
  const incomingCard = ref<UserCard | null>(null);

  const saveProfile = (profile: Profile) => {
    const { userCard, ...rest } = profile;

    incomingProfile.value = rest;
    incomingCard.value = userCard || null;
    // Save only profile data (rest) into localStorage as test purposes
    try {
      localStorage.setItem('tempUserProfile', JSON.stringify(rest));
    } catch (err) {
      console.error('Failed to save profile to localStorage:', err);
    }
    // For demo purposes, log the saved data
    console.table(incomingProfile.value.userName);
    console.table(incomingProfile.value.userMeta);
    console.table(incomingProfile.value.userAddress);
    console.table(incomingCard.value);
  };

  const isLoading = reactive({
    userProfile: false,
    userCard: false
  });

  const isAnyLoading = computed(() => isLoading.userProfile || isLoading.userCard);

  const saveProfileData = () => {
    incomingProfile.value = mockProfile as Profile;
  };

  const randomCard = (): UserCard => {
    const cards = Object.values(mockCards);
    return cards[Math.floor(Math.random() * cards.length)] as UserCard;
  };

  const saveCardData = () => {
    incomingCard.value = randomCard();
  };

  onMounted(() => {
    isLoading.userProfile = true;
    setTimeout(() => {
      saveProfileData();
      isLoading.userProfile = false;
    }, 500);

    isLoading.userCard = true;
    setTimeout(() => {
      saveCardData();
      isLoading.userCard = false;
    }, 1500);
  });
</script>

<template>
  <main class="user-profile-page">
    <LoaderModal v-if="isAnyLoading" message="Loading user profile..." />

    <UserProfile
      v-if="incomingProfile && incomingCard && !isAnyLoading"
      :options="{
        incomingProfile: incomingProfile,
        incomingCard: incomingCard
      }"
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
