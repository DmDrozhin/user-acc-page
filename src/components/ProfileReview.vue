<script setup lang="ts">
  import { computed } from 'vue';
  import { PREVIEW_PAGE } from '@/data/designations';
  import { formatPhone, formatCardNumber } from '@/utils/utils';

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
  const formatPhoneNumber = (phone: string) => {
    return formatPhone(phone);
  };
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
      case 'american-express':
        return PREVIEW_PAGE.sectionCard.paySystem['american-express'];
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
  const maskedCardNumber = computed(() => {
    if (mainOptions.value.card?.paySystem === 'american-express') {
      return `**** ****** ${formatCardNumber(mainOptions.value.card.cardNumber, '#### ###### #####').slice(-5)}`;
    } else {
      return `**** **** **** ${formatCardNumber(mainOptions.value.card?.cardNumber || '', '#### #### #### ####').slice(-4)}`;
    }
  });
</script>

<template>
  <div class="profile-review">
    <!-- NAME & AVATAR -->
    <section class="card profile-header" v-if="mainOptions.profile?.userName">
      <img v-if="mainOptions.profile.userName.avatar" :src="mainOptions.profile.userName.avatar" alt="Avatar" class="avatar" />
      <img v-else :src="PREVIEW_PAGE.sectionName.titleIcon" alt="Avatar placeholder" class="avatar placeholder" />

      <div class="profile-header__names">
        <div class="profile-header__full-name">
          <span>{{ mainOptions.profile.userName.firstName }}</span>
          <span v-if="mainOptions.profile.userName.middleName">
            {{ mainOptions.profile.userName.middleName }}
          </span>
        </div>
        <div v-if="mainOptions.profile.userName.lastName" class="profile-header__last-name">
          {{ mainOptions.profile.userName.lastName }}
        </div>
      </div>
    </section>

    <!-- META INFO -->
    <section class="card" v-if="mainOptions.profile?.userMeta">
      <div class="card__title">
        <img :src="PREVIEW_PAGE.sectionMeta.iconInfo" class="title-icon" />
        <span>{{ PREVIEW_PAGE.sectionMeta.title }}</span>
      </div>
      <hr class="card__divider" />
      <div class="info-grid">
        <div class="info-row">
          <img class="small-icon" :src="PREVIEW_PAGE.sectionMeta.iconPhone" />
          <span>{{ formatPhoneNumber(mainOptions.profile.userMeta.phone) }}</span>
        </div>

        <div class="info-row">
          <img class="small-icon" :src="PREVIEW_PAGE.sectionMeta.iconEmail" />
          <span>{{ mainOptions.profile.userMeta.email }}</span>
        </div>

        <div class="info-row">
          <img class="small-icon" :src="PREVIEW_PAGE.sectionMeta.iconBirthDate" />
          <span>{{ mainOptions.profile.userMeta.birthDate }}</span>
        </div>

        <div class="info-row">
          <img class="small-icon" :src="genderIcon" />
          <span class="info-row__gender">{{ mainOptions.profile.userMeta.gender }}</span>
        </div>
      </div>
    </section>

    <!-- ADDRESS -->
    <section class="card" v-if="mainOptions.profile?.userAddress">
      <div class="card__title">
        <img class="title-icon" :src="PREVIEW_PAGE.sectionAddress.titleIcon" />
        <span>Address</span>
      </div>
      <hr class="card__divider" />
      <div class="info-grid">
        <span class="address-text">
          {{ mainOptions.profile.userAddress.city }}, {{ mainOptions.profile.userAddress.country }},
          {{ mainOptions.profile.userAddress.street }}, {{ mainOptions.profile.userAddress.zip }},
          {{ mainOptions.profile.userAddress.state }}
        </span>
      </div>
    </section>

    <!-- CARD INFO -->
    <section class="card" v-if="mainOptions.card">
      <div class="card__title">
        <img class="title-icon" :src="PREVIEW_PAGE.sectionCard.titleIcon" />
        <span>Bank Card</span>
      </div>
      <hr class="card__divider" />
      <div class="info-grid">
        <div class="info-row">
          <img class="small-icon" :src="PREVIEW_PAGE.sectionCard.iconNumber" />
          <span>{{ maskedCardNumber }}</span>
        </div>

        <div class="info-row">
          <img class="small-icon" :src="PREVIEW_PAGE.sectionCard.iconHolder" />
          <span>{{ mainOptions.card.holderName }}</span>
        </div>

        <div class="info-row">
          <img class="small-icon" :src="PREVIEW_PAGE.sectionCard.iconExpiry" />
          <span>{{ mainOptions.card.expiry }}</span>
        </div>

        <div class="info-row">
          <img class="tm-icon" :src="paySystemIcon" />
          <span class="info-row__pay-system">{{ mainOptions.card.paySystem }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .profile-review {
    display: grid;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;

    .card {
      background: $surface;
      border: 1px solid $border-color;
      border-radius: $radius-lg;
      padding: $spacing-lg;
      box-shadow: $shadow-sm;
      transition: $transition;
      &:hover {
        box-shadow: $box-shadow-sm;
      }

      &__title {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        font-weight: 600;
        font-size: $font-size-lg;
        margin-bottom: $spacing-md;
      }
      &__divider {
        margin-bottom: $spacing-md;
      }
    }

    /* Header */
    .profile-header {
      display: flex;
      align-items: center;
      gap: $spacing-lg;

      .avatar {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        object-fit: cover;
        background: $surface-secondary;

        &.placeholder {
          opacity: 0.5;
          padding: $spacing-xs;
        }
      }

      &__names {
        display: flex;
        flex-direction: column;
      }

      &__full-name {
        display: flex;
        gap: $spacing-xs;
        font-size: 1.25rem;
        font-weight: 600;
      }

      &__last-name {
        font-size: 1rem;
        color: $text-secondary;
      }
    }

    /* Info grid */
    .info-grid {
      display: grid;
      gap: $spacing-sm;

      .info-row {
        display: flex;
        gap: $spacing-xs;
        align-items: center;
        font-size: $font-size-md;
        color: $text-primary;
        &__gender,
        &__pay-system {
          text-transform: capitalize;
        }
      }
      .tm-icon {
        max-width: 4rem;
        max-height: 2rem;
        height: auto;
      }
      .address-text {
        font-size: $font-size-md;
        color: $text-primary;
        line-height: 1.5;
      }
    }
  }
</style>
