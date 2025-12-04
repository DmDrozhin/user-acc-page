<script setup lang="ts">
  import { computed } from 'vue';
  import { PREVIEW_PAGE } from '@/data/designations';

  // Props
  interface Props {
    options?: {
      userProfile?: Partial<Profile> | null;
      userCard?: UserCard | null;
      uuid?: string;
    };
  }
  const props = withDefaults(defineProps<Props>(), {
    options: () => ({})
  });

  const mainOptions = computed(() => ({
    profile: props.options?.userProfile || null,
    card: props.options?.userCard || null,
    uuid: props.options?.uuid || ''
  }));
  const genderIcon = computed(() => {
    return mainOptions.value.profile?.userMeta?.gender === 'male'
      ? PREVIEW_PAGE.sectionMeta.iconGenderMale
      : mainOptions.value.profile?.userMeta?.gender === 'female'
        ? PREVIEW_PAGE.sectionMeta.iconGenderFemale
        : PREVIEW_PAGE.sectionMeta.iconGenderOther;
  });
  const paySystemIcon = computed(() => {
    switch (mainOptions.value.card?.paySystem) {
      case 'visa':
        return PREVIEW_PAGE.sectionCard.paySystem.visa;
      case 'mastercard':
        return PREVIEW_PAGE.sectionCard.paySystem.mastercard;
      case 'amex':
        return PREVIEW_PAGE.sectionCard.paySystem.amex;
      case 'discover':
        return PREVIEW_PAGE.sectionCard.paySystem.discover;
      case 'mir':
        return PREVIEW_PAGE.sectionCard.paySystem.mir;
      case 'unionpay':
        return PREVIEW_PAGE.sectionCard.paySystem.unionpay;
      default:
        return PREVIEW_PAGE.sectionCard.paySystem.unknown;
    }
  });
</script>

<template>
  <div class="profile-review">
    <div class="profile-review__name-block" v-if="mainOptions.profile?.userName">
      <img
        v-if="mainOptions.profile?.userName?.avatar"
        class="profile-review__avatar"
        :src="mainOptions.profile?.userName?.avatar ?? undefined"
        alt="User Avatar" />
      <img v-else class="profile-review__avatar-placeholder" :src="PREVIEW_PAGE.sectionName.titleIcon" alt="Avatar placeholder" />
      <div class="profile-review__names">
        <div class="wrapper-base">
          <div class="profile-review__first-name" v-if="mainOptions.profile?.userName">
            {{ mainOptions.profile.userName.firstName }}
          </div>
          <div class="profile-review__middle-name" v-if="mainOptions.profile?.userName?.middleName">
            {{ mainOptions.profile.userName.middleName }}
          </div>
        </div>
        <div class="profile-review__last-name" v-if="mainOptions.profile?.userName?.lastName">
          {{ mainOptions.profile.userName.lastName }}
        </div>
      </div>
    </div>

    <div class="profile-review__meta-block">
      <div class="profile-review__heading meta">
        <img class="simple-icon" :src="PREVIEW_PAGE.sectionMeta.iconInfo" alt="Contact icon" />
        {{ PREVIEW_PAGE.sectionMeta.title }}:
      </div>
      <div v-if="mainOptions.profile?.userMeta">
        <div class="wrapper-base phone">
          <img class="simple-icon" :src="PREVIEW_PAGE.sectionMeta.iconPhone" />
          <span class="">{{ mainOptions.profile.userMeta.phone }}</span>
        </div>
        <div class="wrapper-base email">
          <img class="simple-icon" :src="PREVIEW_PAGE.sectionMeta.iconEmail" />
          {{ mainOptions.profile.userMeta.email }}
        </div>
        <div class="wrapper-base birth-date">
          <img class="simple-icon" :src="PREVIEW_PAGE.sectionMeta.iconBirthDate" />
          <span>Birth Date:</span>
          {{ mainOptions.profile.userMeta.birthDate }}
        </div>
        <div class="wrapper-base gender">
          <img class="simple-icon" :src="genderIcon" />
          <span>Gender:</span>
          {{ mainOptions.profile.userMeta.gender.charAt(0).toUpperCase() + mainOptions.profile.userMeta.gender.slice(1) }}
        </div>
      </div>
    </div>

    <div class="profile-review__address-block" v-if="mainOptions.profile?.userAddress">
      <div class="profile-review__heading">
        <img class="simple-icon" :src="PREVIEW_PAGE.sectionAddress.titleIcon" alt="Location icon" />
        <span>Address:</span>
      </div>
      {{ mainOptions.profile?.userAddress?.city }}, {{ mainOptions.profile?.userAddress?.country }},
      {{ mainOptions.profile?.userAddress?.street }}, {{ mainOptions.profile?.userAddress?.zip }},
      {{ mainOptions.profile?.userAddress?.state }}
    </div>

    <div class="profile-review__bank-card-block" v-if="mainOptions.card">
      <div class="profile-review__heading">
        <img class="simple-icon" :src="PREVIEW_PAGE.sectionCard.titleIcon" alt="Card icon" />
        <span>Bank Card:</span>
      </div>
      <div>
        <div class="wrapper-base">
          <img class="simple-icon" :src="PREVIEW_PAGE.sectionCard.iconNumber" alt="Card icon" />
          <span>Card Number:</span>
          <span>**** **** **** {{ mainOptions.card.cardNumber.slice(-4) }}</span>
        </div>
      </div>
      <div class="wrapper-base">
          <img class="simple-icon" :src="PREVIEW_PAGE.sectionCard.iconHolder" alt="Holder icon" />
          <span>Holder: </span>
          {{ mainOptions.card.holderName }}
        </div>
        <div class="wrapper-base">
          <img class="simple-icon" :src="PREVIEW_PAGE.sectionCard.iconExpiry" alt="Expiry icon" />
          <span>Expiry & Pay System: </span>
          {{ mainOptions.card.expiry }}
        </div>
        <div>
          <img class="simple-icon" :src="PREVIEW_PAGE.sectionCard.iconCvv" alt="CVV icon" />
          <span>CVV: </span>
          <span>****</span>
        </div>
        <div>
          <span>Payment System: </span>
          <img class="simple-icon" :src="paySystemIcon" alt="Pay System icon" />
          {{ mainOptions.card.paySystem }}
        </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .profile-review {
    &__name-block {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    &__heading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
    }
    &__avatar-placeholder {
      filter: opacity(0.5);
      padding: 0.5rem;
    }
    &__avatar-placeholder,
    &__avatar {
      $size: calc($spacing-xl * 3);
      width: $size;
      height: $size;
      border-radius: 50%;
      object-fit: cover;
      text-align: center;
      align-content: center;
      font-size: $font-size-sm;
      background-color: rgba(0, 0, 0, 0.1);
    }
    &__names {
      display: flex;
      flex-direction: column;
    }
    &__first-name,
    &__middle-name,
    &__last-name {
      font-size: $font-size-lg;
      font-weight: 500;
    }
    &__address-block {
      color: $text-secondary;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  }
</style>
