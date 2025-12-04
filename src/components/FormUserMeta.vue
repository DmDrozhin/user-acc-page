<script setup lang="ts">
  import { computed, reactive, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { INPUTS_USER_META } from '@/data/designations.ts';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';

  interface Props {
    options?: UserMeta | null;
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

  const defaultProfile = (): UserMeta => ({
    phone: '',
    email: '',
    birthDate: '',
    gender: 'not selected' as GenderOptions
  });
  const user = reactive<UserMeta>(defaultProfile());
  const touched = reactive<Record<keyof UserMeta, boolean>>({
    phone: false,
    email: false,
    birthDate: false,
    gender: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const rules: Rules = {
    phone: [
      { required: true, message: 'Phone number is required' },
      { type: 'string', message: 'Phone number must be a string' },
      { pattern: /^\+?[0-9]{1,4}?[-.\s()]?[0-9]{1,4}[-.\s()]?[0-9]{1,9}$/, message: 'Phone number is not valid' },
      { min: 8, max: 15, message: 'Phone number must be between 8 and 15 characters' }
    ],
    email: [{ type: 'email', required: false, max: 150, message: 'Email is not valid' }],
    birthDate: [{ type: 'date', required: false, message: 'Birth Date is not valid' }],
    gender: [
      { type: 'string', required: false, message: 'Gender is not valid' },
      { enum: ['male', 'female'], required: false, message: 'Gender must be either male or female' }
    ]
  };
  const { pass, isFinished, errorFields } = useAsyncValidator(user, rules);
  const isValidForm = computed(() => pass.value && isFinished.value);
  watch(isValidForm, (v) => emit('update:isValid', v), { immediate: true });

  const resetForms = () => {
    // Reset user meta data
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
  // Set initial values from props.options
  const setInitialValues = () => {
    if (!props.options) return;
    user.phone = props.options.phone || '';
    user.email = props.options.email || '';
    user.birthDate = props.options.birthDate || '';
    user.gender = props.options.gender || '';
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
  <form class="form user-meta">
    <div class="form__indicator" :class="{ form_ready: isValidForm }"></div>
    <!-- Email and Phone -->
    <div class="form__row-wrapper phone-email">
      <!-- Phone -->
      <div class="form__block phone">
        <label class="form__label" for="phone">{{ INPUTS_USER_META.phone.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" v-if="INPUTS_USER_META.phone.icon" :src="INPUTS_USER_META.phone.icon" alt="Phone icon" />
          <input
            :class="['form__input', { 'form__input--error': errorFields?.phone?.length && touched.phone }]"
            id="phone"
            v-model.trim="user.phone"
            type="text"
            :placeholder="INPUTS_USER_META.phone.placeholder"
            @blur="markTouched('phone')" />
        </div>
        <div class="form__error" v-if="errorFields?.phone?.length && touched.phone">{{ errorFields?.phone?.[0]?.message }}</div>
      </div>
      <!-- Email -->
      <div class="form__block email">
        <label class="form__label" for="email">{{ INPUTS_USER_META.email.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" v-if="INPUTS_USER_META.email.icon" :src="INPUTS_USER_META.email.icon" alt="Email icon" />
          <input
            :class="['form__input', { 'form__input--error': errorFields?.email?.length && touched.email }]"
            id="email"
            v-model.trim="user.email"
            type="text"
            :placeholder="INPUTS_USER_META.email.placeholder"
            @blur="markTouched('email')" />
        </div>
        <div class="form__error" v-if="errorFields?.email?.length && touched.email">
          {{ errorFields?.email?.[0]?.message }}
        </div>
      </div>
    </div>
    <!-- Birth Date and Gender -->
    <div class="form__row-wrapper birthday-gender">
      <!-- Birth Date -->
      <div class="form__block birthday">
        <label class="form__label" for="birthDate">{{ INPUTS_USER_META.birthDate.label }}</label>
        <div class="form__input-wrapper">
          <img
            class="simple-icon"
            v-if="INPUTS_USER_META.birthDate.icon"
            :src="INPUTS_USER_META.birthDate.icon"
            alt="Birth Date icon" />
          <input
            type="date"
            :class="['form__input', { 'form__input--error': errorFields?.birthDate?.length && touched.birthDate }]"
            id="birthDate"
            min="1900-01-01"
            max="2025-11-30"
            v-model.trim="user.birthDate"
            :placeholder="INPUTS_USER_META.birthDate.placeholder"
            @blur="markTouched('birthDate')" />
        </div>
        <div class="form__error" v-if="errorFields?.birthDate?.length && touched.birthDate">
          {{ errorFields?.birthDate?.[0]?.message }}
        </div>
      </div>
      <!-- Gender -->
      <div class="form__block gender">
        <label class="form__label" for="gender">{{ INPUTS_USER_META.gender.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" v-if="INPUTS_USER_META.gender.icon" :src="INPUTS_USER_META.gender.icon" alt="Name icon" />
          <select
            id="gender"
            v-model="user.gender"
            :class="['form__input', { 'form__input--error': errorFields?.gender?.length && touched.gender }]"
            @blur="markTouched('gender')">
            <option v-for="(option, idx) in INPUTS_USER_META.gender.options" :key="idx" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="form__error" v-if="errorFields?.gender?.length && touched.gender">
          {{ errorFields?.gender?.[0]?.message }}
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .form {
    flex-direction: column;
    &__row-wrapper.birthday-gender {
      width: fit-content;
    }
  }
  @media screen and (max-width: $breakpoint-sm) {
    .form {
      &__row-wrapper {
        flex-wrap: wrap;
      }
      &__block.birthday,
      &__block.gender {
        width: fit-content;
      }
    }
  }
  // Specific styles for standard HTML inputs
  select,
  ::picker(select) {
    font-size: $font-size-md;
    color: $text-secondary;
    appearance: base-select;
    padding: 0.5rem 1rem;
  }
  select::picker-icon {
    color: $text-secondary;
    transition: 0.4s rotate;
  }
  select:open::picker-icon {
    rotate: 180deg;
  }
  // Date input styles
  ::picker(input) {
    // font-size: $font-size-md;
    color: $text-secondary;
    appearance: base-input;
  }
  ::-webkit-calendar-picker-indicator {
    color: $text-secondary;
    transition: 0.4s color;
    filter: opacity(0.5);
  }
  #gender {
    text-transform: capitalize;
  }
</style>
