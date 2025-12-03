<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
  import { ACCOUNT_PAGE_HEADER } from '@/data/designations';

  import FromUserName from '@/components/FormUserName.vue';
  import FormUserMeta from '@/components/FormUserMeta.vue';
  import FormUserAddress from '@/components/FormUserAddress.vue';
  import FormUserBankCard from '@/components/FormUserBankCard.vue';

  // Props
  interface Props {
    options?: {
      incomingProfile?: Profile | null;
      incomingCard?: Profile['userCard'] | null;
      uuid?: string;
    };
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => ({})
  });

  // State
  const resetKey = ref(0);
  const currentState = ref<'view' | 'edit'>('view');

  // Track validation status of each form
  const formsValidated = reactive<Record<string, boolean>>({
    userName: false,
    userMeta: false,
    userAddress: false,
    userBankCard: false
  });

  const isAllFormsValid = computed(() => Object.values(formsValidated).every(Boolean));

  // Default Data Factory
  const defaultProfile = (): Profile => ({
    uuid: '',
    userName: {
      firstName: '',
      middleName: '',
      lastName: '',
      avatarUrl: '',
      avatar: null
    },
    userMeta: {
      phone: '',
      email: '',
      birthDate: '',
      gender: 'not selected'
    },
    userAddress: {
      street: '',
      state: '',
      country: '',
      zip: '',
      city: ''
    },
    userCard: {
      uuid: '',
      cardNumber: '',
      holderName: '',
      expiry: '',
      cvv: '',
      paySystem: ''
    }
  });

  // Reactive profile
  const profile = reactive<Profile>(defaultProfile());

  // Methods
  const updateProfile = (formName: keyof Profile, newData: Partial<Profile[typeof formName]>) => {
    const target = profile[formName];
    if (target && typeof target === 'object') {
      Object.assign(target, newData);
    }
  };

  const updateFormValidity = (formName: string, isValid: boolean) => {
    formsValidated[formName] = isValid;
  };

  const resetForms = () => {
    Object.assign(profile, defaultProfile());

    Object.keys(formsValidated).forEach((key) => {
      formsValidated[key] = false;
    });

    // notify children
    resetKey.value += 1;
  };
  const initialUpdateProfile = (profile: Profile) => {
    if (profile.userName) updateProfile('userName', profile.userName);
    if (profile.userMeta) updateProfile('userMeta', profile.userMeta);
    if (profile.userAddress) updateProfile('userAddress', profile.userAddress);
    if (profile.uuid) profile.uuid = profile.uuid;
  };
  const initialUpdateCard = (card: UserCard) => {
    if (card) {
      updateProfile('userCard', card);
    }
  };
  const onCancelEdit = () => {
    if (props.options?.incomingProfile) {
      initialUpdateProfile(props.options.incomingProfile);
    }
    if (props.options?.incomingCard) {
      initialUpdateCard(props.options.incomingCard);
    }
    currentState.value = 'view';
  };
  // Watchers
  watch(
    () => props.options?.incomingProfile,
    (profile) => {
      if (profile) initialUpdateProfile(profile);
    },
    { immediate: true, deep: true }
  );
  watch(
    () => props.options?.incomingCard,
    (card) => {
      if (card) initialUpdateCard(card);
    },
    { immediate: true, deep: true }
  );
</script>

<template>
  <div class="profile">
    <!-- Header -->
    <div class="header-block">
      <img class="title-icon" v-if="currentState === 'view'" :src="ACCOUNT_PAGE_HEADER.iconStatic" alt="review profile icon" />
      <img class="title-icon" v-else :src="ACCOUNT_PAGE_HEADER.iconEdit" alt="edit profile icon" />
      <div class="header-block__wrapper">
        <div class="header-block__title">{{ ACCOUNT_PAGE_HEADER.title }}</div>
        <div class="header-block__subtitle">{{ ACCOUNT_PAGE_HEADER.subtitle }}</div>
      </div>
    </div>

    <div class="profile__content">
      <!-- VIEW MODE -->
      <template v-if="currentState === 'view'"></template>

      <!-- EDIT MODE -->
      <template v-else-if="currentState === 'edit'">
        <FromUserName
          :resetKey="resetKey"
          :options="profile.userName"
          @update:user="(data) => updateProfile('userName', data)"
          @update:is-valid="(v) => updateFormValidity('userName', v)" />

        <FormUserMeta
          :resetKey="resetKey"
          :options="profile.userMeta"
          @update:user="(data) => updateProfile('userMeta', data)"
          @update:is-valid="(v) => updateFormValidity('userMeta', v)" />

        <FormUserAddress
          :resetKey="resetKey"
          :options="profile.userAddress"
          @update:user="(data) => updateProfile('userAddress', data)"
          @update:is-valid="(v) => updateFormValidity('userAddress', v)" />

        <hr class="profile__divider" />

        <FormUserBankCard
          :resetKey="resetKey"
          :options="profile.userCard"
          @update:card="(data) => updateProfile('userCard', data)"
          @update:is-valid="(v) => updateFormValidity('userBankCard', v)" />
      </template>

      <hr class="profile__divider" />

      <!-- Action buttons -->
      <div class="actions-block">
        <template v-if="currentState === 'edit'">
          <button class="actions-block__button reset" @click="resetForms">Reset All</button>
          <div class="actions-block__buttons-group">
            <button class="actions-block__button save" :disabled="!isAllFormsValid" @click="currentState = 'view'">
              Save Changes
            </button>
            <button class="actions-block__button cancel" @click="onCancelEdit">Cancel</button>
          </div>
        </template>

        <template v-else>
          <button class="actions-block__button edit" @click="currentState = 'edit'">Edit Profile</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use 'sass:color';
  @use '@/styles/elements.scss' as *;

  .profile {
    &__content {
      position: relative;
      padding: 1.5rem;
      margin: 0 auto;
      background-color: $surface;
      border-radius: $radius-md;
      box-shadow: $shadow-md;
    }
    &__divider {
      margin: 0.5rem 0 1.5rem 0;
      border: none;
      border-top: 1px solid $border-color;
    }
  }

  .header-block {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    background-color: $surface;
    border-radius: $radius-md;
    box-shadow: $shadow-md;

    &__title {
      font-size: 1.5rem;
      font-weight: 600;
    }
    &__subtitle {
      font-size: 1rem;
      color: $text-secondary;
    }
  }

  .actions-block {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;

    &__buttons-group {
      display: flex;
      gap: 1rem;
    }

    &__button {
      min-width: calc($spacing-xl * 4);
      padding: 0.5rem 1rem;
      border-radius: $border-radius-sm;
      border: 1px solid transparent;
      transition: $transition;
      cursor: pointer;
      &.edit {
        margin-left: auto;
      }
      &.save,
      &.edit {
        background-color: $primary-color;
        color: $surface;
        &:hover {
          background: color.adjust($primary-color, $lightness: -5%);
        }
        &:disabled {
          background: color.adjust($primary-color, $lightness: 25%);
          cursor: not-allowed;
        }
      }

      &.cancel {
        background-color: $border-color;
        color: $text-primary;
        &:hover {
          background: color.adjust($border-color, $lightness: -5%);
        }
      }
      &.reset {
        background-color: $surface-secondary;
        color: $error-color;
        &:hover {
          background: color.adjust($surface-secondary, $lightness: -5%);
        }
      }
    }
  }
</style>
