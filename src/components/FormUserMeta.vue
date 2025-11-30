<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, ref, reactive, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { INPUTS_USER_META } from '@/data/designations.ts';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';

  interface Props {
    options?: Record<string, unknown>;
  }
  const props = withDefaults(defineProps<Props>(), {
    options: () => ({})
  });

  const user = reactive({ phone: '', email: '', birthDate: '', gender: INPUTS_USER_META.gender.options?.[0] ?? '' });
  const touched = reactive({
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
  watch(isFinished, (val) => {
    console.log('isFinished value', val);
    // Trigger validation on user data change
  });
  const defaultOptions: Record<string, unknown> = {};
  const mainOptions = computed(() => ({
    ...props.options,
    ...defaultOptions
  }));
</script>

<template>
  <div class="form user-meta">
    <!-- Email and Phone -->
    <div class="form__row-wrapper phone-email">
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
    <div class="form__row-wrapper birthday-gender">
      <div class="form__block date-of-birth">
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
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .form {
    &.user-meta {
    }
    &__row-wrapper.phone-email {
    }
    &__row-wrapper.birthday-gender {
      max-width: 40%;
      .form__block {
        flex: 1;
      }
    }
  }
  @media screen and (max-width: $breakpoint-xl) {
    .form {
      flex-wrap: wrap;
    }
  }
  @media screen and (max-width: $breakpoint-md) {
    .form {
      &__row-wrapper.phone-email {
        flex-wrap: wrap;
      }
      &__row-wrapper.birthday-gender {
        max-width: 100%;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .form {
      &__row-wrapper.birthday-gender {
        flex-wrap: wrap;
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
</style>
