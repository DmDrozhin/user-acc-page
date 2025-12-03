<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
  import { ACCOUNT_PAGE_HEADER } from '@/data/designations';
  import FromUserName from '@/components/FormUserName.vue';
  import FormUserMeta from '@/components/FormUserMeta.vue';
  import FormUserAddress from '@/components/FormUserAddress.vue';
  import FormUserBankCard from '@/components/FormUserBankCard.vue';

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

  const resetKey = ref<number>(0);

  const currentState = ref<'view' | 'edit'>('view');
  const formsValidated = reactive<Record<string, boolean>>({
    userName: false,
    userMeta: false,
    userAddress: false,
    userBankCard: false
  });
  const isAllFormsValid = computed(() => Object.values(formsValidated).every((isValid) => isValid));

  // Profile and Card Info states
  const profile = reactive<Profile>({
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
      gender: ''
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

  const updateProfile = (form: keyof Profile | undefined, newData: Partial<Profile[keyof Profile]>) => {
    if (form && profile[form]) {
      Object.assign(profile[form], newData);
    } else if (!form) {
      Object.assign(profile, newData);
    }
  };
  const updateFormValidity = (formName: string, isValid: boolean) => {
    formsValidated[formName] = isValid;
  };
  const resetForms = () => {
    // Reset profile data
    profile.userName = {
      firstName: '',
      middleName: '',
      lastName: '',
      avatarUrl: '',
      avatar: null
    };
    profile.userMeta = {
      phone: '',
      email: '',
      birthDate: '',
      gender: ''
    };
    profile.userAddress = {
      street: '',
      state: '',
      country: '',
      zip: '',
      city: ''
    };
    profile.userCard = {
      uuid: '',
      cardNumber: '',
      holderName: '',
      expiry: '',
      cvv: '',
      paySystem: ''
    };
    // Increment reset key to notify child components
    resetKey.value += 1;
  };

  watch(
    () => props.options?.incomingProfile,
    (props) => {
      if (props && props.userName && props.userMeta && props.userAddress) {
        updateProfile('userName', props.userName as UserName);
        updateProfile('userMeta', props.userMeta as Profile['userMeta']);
        updateProfile('userAddress', props.userAddress as Profile['userAddress']);
        if (props.uuid) {
          profile.uuid = props.uuid;
        }
      }
    },
    { immediate: true }
  );
  watch(
    () => props.options?.incomingCard,
    (props) => {
      if (props) {
        updateProfile('userCard', props as Profile['userCard']);
      }
    },
    { immediate: true }
  );
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
  <div class="profile__content">
    <!-- View Mode Content Here -->
    <template v-if="currentState === 'view'"></template>
    <!-- Edit Mode Content Here -->
    <template v-else-if="currentState === 'edit'">
      <FromUserName
        :resetKey="resetKey"
        :options="profile.userName"
        @update:user="(data) => updateProfile('userName', data)"
        @update:is-valid="(isValid) => updateFormValidity('userName', isValid)" />
      <FormUserMeta
        :resetKey="resetKey"
        :options="profile.userMeta"
        @update:user="(data) => updateProfile('userMeta', data)"
        @update:is-valid="(isValid) => updateFormValidity('userMeta', isValid)" />
      <FormUserAddress
        :resetKey="resetKey"
        :options="profile.userAddress"
        @update:user="(data) => updateProfile('userAddress', data)"
        @update:is-valid="(isValid) => updateFormValidity('userAddress', isValid)" />
      <hr class="profile__divider" />
      <FormUserBankCard
        :resetKey="resetKey"
        :options="profile.userCard"
        @update:card="(data) => updateProfile('userCard', data)"
        @update:is-valid="(isValid) => updateFormValidity('userBankCard', isValid)" />
    </template>
    <hr class="profile__divider" />
    <div class="actions-block">
      <div class="actions-block__buttons-group">
        <template v-if="currentState === 'edit'">
          <button class="actions-block__button save" :disabled="!isAllFormsValid" @click="currentState = 'view'">
            Save Changes
          </button>
          <button class="actions-block__button reset" @click="resetForms">Reset All</button>
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
    // &__wrapper {
    // }
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
    justify-content: flex-end;
    margin: 1rem 0;
    &__buttons-group {
      display: flex;
      gap: 1rem;
    }
    &__button {
      min-width: calc($spacing-lg * 4); // 96px
      padding: $spacing-xs $spacing-base;
      border-radius: $border-radius-sm;
      border: 1px solid transparent;
      transition: $transition;
      cursor: pointer;
      &.save {
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
      &.reset {
        background-color: $border-color;
        color: $text-primary;
        &:hover {
          background: color.adjust($border-color, $lightness: -5%);
        }
      }
    }
  }
</style>
