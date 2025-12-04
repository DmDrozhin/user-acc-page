<script setup lang="ts">
  import { computed, reactive, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_USER_NAME } from '@/data/designations.ts';
  import AvatarUploader from '@/components/AvatarUploader.vue';

  interface Props {
    options?: UserName | null;
    resetKey: number; // To reset the form
  }
  const props = withDefaults(defineProps<Props>(), {
    options: null,
    resetKey: 0
  });

  const emit = defineEmits<{
    (e: 'update:isValid', value: boolean): void;
    (e: 'update:user', value: typeof user): void;
  }>();

  const defaultProfile = (): UserName => ({
    firstName: '',
    middleName: '',
    lastName: '',
    avatar: null,
    avatarUrl: ''
  });
  const user = reactive<UserName>(defaultProfile());
  const touched = reactive<Record<keyof UserName, boolean>>({
    firstName: false,
    middleName: false,
    lastName: false,
    avatar: false,
    avatarUrl: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const rules: Rules = {
    firstName: [
      { required: true, type: 'string', message: 'Name is required' },
      { min: 3, max: 20, message: 'Must be between 3 and 20 characters' }
    ],
    middleName: [{ type: 'string', min: 3, max: 20, required: false, message: 'Must be between 3 and 20 characters' }],
    lastName: [
      { required: true, type: 'string', message: 'Last Name is required' },
      { min: 3, max: 20, message: 'Must be between 3 and 20 characters' }
    ]
  };
  const { pass, isFinished, errorFields } = useAsyncValidator(user, rules);
  const isValidForm = computed(() => pass.value && isFinished.value);
  watch(isValidForm, (v) => emit('update:isValid', v), { immediate: true });

  const resetForms = () => {
    // Reset user data
    Object.assign(user, defaultProfile());
    Object.keys(touched).forEach((key) => {
      touched[key as keyof typeof touched] = false;
    });
  };
  // Reset form when resetKey changes
  watch(
    () => props.resetKey,
    () => resetForms()
  );
  // Set initial values from options prop
  const setInitialValues = () => {
    if (!props.options) return;
    user.firstName = props.options.firstName || '';
    user.middleName = props.options.middleName || '';
    user.lastName = props.options.lastName || '';
    user.avatar = props.options.avatar || '';
    user.avatarUrl = props.options.avatarUrl || '';
  };
  // Set initial values on mount
  setInitialValues();
  // Update values when options prop changes
  watch(
    () => props.options,
    () => setInitialValues(),
    { deep: true }
  );
  // Emit user data on changes
  watch(user, (val) => emit('update:user', { ...val }), { deep: true });
</script>

<template>
  <form class="form user-name">
    <div class="form__indicator" :class="{ form_ready: isValidForm }"></div>
    <div class="form__column-wrapper avatar">
      <AvatarUploader
        class="form__avatar-uploader"
        :resetKey="props.resetKey"
        :options="{ avatar: user.avatar, avatarUrl: '' }"
        v-model:avatar="user.avatar"
        @update:avatar="markTouched('avatar')" />
    </div>
    <!-- First, Middle and Second Name -->
    <div class="form__column-wrapper names">
      <div class="form__wrapper">
        <!-- First name -->
        <div class="form__block first-name">
          <label class="form__label" for="first-name">{{ INPUTS_USER_NAME.firstName.label }}</label>
          <div class="form__input-wrapper">
            <img
              class="simple-icon"
              v-if="INPUTS_USER_NAME.firstName.icon"
              :src="INPUTS_USER_NAME.firstName.icon"
              alt="Name icon" />
            <input
              :class="['form__input', { 'form__input--error': errorFields?.firstName?.length && touched.firstName }]"
              id="first-name"
              v-model.trim="user.firstName"
              type="text"
              :placeholder="INPUTS_USER_NAME.firstName.placeholder"
              @blur="markTouched('firstName')" />
          </div>
          <div class="form__error" v-if="errorFields?.firstName?.length && touched.firstName">
            {{ errorFields?.firstName?.[0]?.message }}
          </div>
        </div>
        <!-- Middle name -->
        <div class="form__block middle-name">
          <label class="form__label" for="middle-name">{{ INPUTS_USER_NAME.middleName.label }}</label>
          <div class="form__input-wrapper no-icon">
            <img
              class="simple-icon"
              v-if="INPUTS_USER_NAME.middleName.icon"
              :src="INPUTS_USER_NAME.middleName.icon"
              alt="Middle Name icon" />
            <input
              :class="['form__input', { 'form__input--error': errorFields?.middleName?.length && touched.middleName }]"
              id="middle-name"
              v-model.trim="user.middleName"
              type="text"
              :placeholder="INPUTS_USER_NAME.middleName.placeholder"
              @blur="markTouched('middleName')" />
          </div>
          <div class="form__error" v-if="errorFields?.middleName?.length && touched.middleName">
            {{ errorFields?.middleName?.[0]?.message }}
          </div>
        </div>
      </div>
      <!-- Last name -->
      <div class="form__block last-name">
        <label class="form__label" for="last-name">{{ INPUTS_USER_NAME.lastName.label }}</label>
        <div class="form__input-wrapper">
          <img
            class="simple-icon"
            v-if="INPUTS_USER_NAME.lastName.icon"
            :src="INPUTS_USER_NAME.lastName.icon"
            alt="Last Name icon" />
          <input
            :class="['form__input', { 'form__input--error': errorFields?.lastName?.length && touched.lastName }]"
            id="last-name"
            v-model.trim="user.lastName"
            type="text"
            :placeholder="INPUTS_USER_NAME.lastName.placeholder"
            @blur="markTouched('lastName')" />
        </div>
        <div class="form__error" v-if="errorFields?.lastName?.length && touched.lastName">
          {{ errorFields?.lastName?.[0]?.message }}
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .form {
    &__column-wrapper.avatar {
      width: fit-content;
      flex-shrink: 0;
    }
    &__wrapper {
      flex-wrap: nowrap;
    }
  }
  @media screen and (max-width: $breakpoint-md) {
    // 768px
    .form {
      flex-wrap: wrap;
      &__column-wrapper.avatar {
        width: 100%;
      }
    }
  }
  @media screen and (max-width: $breakpoint-sm) {
    // 480px
    .form {
      &__wrapper {
        flex-direction: column;
      }
    }
  }
</style>
