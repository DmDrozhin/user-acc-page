<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, ref, reactive, watch } from 'vue';
  import AvatarUploader from '@/components/AvatarUploader.vue';
  import type { Rules } from 'async-validator';
  import { INPUTS_USER_AVATAR } from '@/data/designations.ts';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';

  interface Props {
    options?: Record<string, unknown>;
  }
  const props = withDefaults(defineProps<Props>(), {
    options: () => ({})
  });
  const minAge = INPUTS_USER_AVATAR.age.minimum ?? 0; // 16

  const user = reactive({ birthDate: '', gender: INPUTS_USER_AVATAR.gender.options?.[0] ?? '', age: '' });
  const touched = reactive({
    birthDate: false,
    gender: false,
    age: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const rules: Rules = {
    birthDate: [{ type: 'date', required: false, message: 'Birth Date is not valid' }],
    gender: [
      { type: 'string', required: false, message: 'Gender is not valid' },
      { enum: ['male', 'female'], required: false, message: 'Gender must be either male or female' }
    ],
    age: [{ type: 'number', min: minAge, required: false, message: `Age must be at least ${minAge}` }]
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
  <div class="user-form user-avatar form">
    <div class="form__row-wrapper">
      <AvatarUploader class="form__avatar-uploader" />

      <div class="form__block date-of-birth">
        <label class="form__label" for="birthDate">{{ INPUTS_USER_AVATAR.birthDate.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_AVATAR.birthDate.icon" alt="Birth Date icon" />
          <input
            type="date"
            :class="['form__input', { 'form__input--error': errorFields?.birthDate?.length && touched.birthDate }]"
            id="birthDate"
            min="1900-01-01"
            max="2025-11-30"
            v-model.trim="user.birthDate"
            :placeholder="INPUTS_USER_AVATAR.birthDate.placeholder"
            @blur="markTouched('birthDate')" />
        </div>
        <div class="form__error" v-if="errorFields?.birthDate?.length && touched.birthDate">
          {{ errorFields?.birthDate?.[0]?.message }}
        </div>
      </div>
    </div>
    <div class="form__row-wrapper">
      <div class="form__block gender">
        <label class="form__label" for="gender">{{ INPUTS_USER_AVATAR.gender.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_AVATAR.gender.icon" alt="Name icon" />
          <select
            id="gender"
            v-model="user.gender"
            :class="['form__input', { 'form__input--error': errorFields?.gender?.length && touched.gender }]"
            @blur="markTouched('gender')">
            <option v-for="(option, idx) in INPUTS_USER_AVATAR.gender.options" :key="idx" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="form__error" v-if="errorFields?.gender?.length && touched.gender">
          {{ errorFields?.gender?.[0]?.message }}
        </div>
      </div>
      <div class="form__block age">
        <label class="form__label" for="age">{{ INPUTS_USER_AVATAR.age.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_AVATAR.age.icon" alt="Age icon" />
          <input
            type="number"
            id="age"
            :class="['form__input', { 'form__input--error': errorFields?.age?.length && touched.age }]"
            v-model.number="user.age"
            :min="minAge"
            placeholder="Age"
            @blur="markTouched('age')" />
        </div>
        <div class="form__error" v-if="errorFields?.age?.length && touched.age">{{ errorFields?.age?.[0]?.message }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .user-form.user-avatar {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    @media screen and (min-width: $breakpoint-lg) {
      flex-wrap: nowrap;
    }
  }
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

<style lang="scss"></style>
