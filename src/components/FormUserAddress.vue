<script setup lang="ts">
  import { computed, reactive, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_USER_ADDRESS } from '@/data/designations.ts';

  interface Props {
    options?: UserAddress | null;
    resetKey: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    options: null,
    resetKey: 0
  });

  const emit = defineEmits<{
    (e: 'update:isValid', value: boolean): void;
    (e: 'update:user', value: typeof user): void;
  }>();

  const user = reactive({
    country: '',
    state: '',
    zip: '',
    city: '',
    street: ''
  });
  const touched = reactive({
    country: false,
    state: false,
    zip: false,
    city: false,
    street: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const rules: Rules = {
    country: [{ type: 'string', min: 3, max: 20, required: true, message: 'Country is required' }],
    state: [{ type: 'string', min: 2, max: 20, required: true, message: 'State/Province is required' }],
    zip: [{ type: 'string', min: 3, max: 20, required: true, message: 'ZIP Code is required' }],
    city: [{ type: 'string', min: 3, max: 20, required: true, message: 'City is required' }],
    street: [{ type: 'string', min: 3, max: 100, required: true, message: 'Street is required' }]
  };
  const { pass, isFinished, errorFields } = useAsyncValidator(user, rules);
  const isValidForm = computed(() => pass.value && isFinished.value);
  watch(isValidForm, (v) => emit('update:isValid', v), { immediate: true });

  const resetForms = () => {
    // Reset user data
    Object.keys(user).forEach((key) => {
      user[key as keyof typeof user] = '';
    });
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
    user.country = props.options.country || '';
    user.state = props.options.state || '';
    user.zip = props.options.zip || '';
    user.city = props.options.city || '';
    user.street = props.options.street || '';
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
  <form class="form user-address">
    <div class="form__indicator" :class="{ form_ready: isValidForm }"></div>
    <!-- Country -->
    <div class="form__block country">
      <label class="form__label" for="country">{{ INPUTS_USER_ADDRESS.country.label }}</label>
      <div class="form__input-wrapper">
        <img
          class="simple-icon"
          v-if="INPUTS_USER_ADDRESS.country.icon"
          :src="INPUTS_USER_ADDRESS.country.icon"
          alt="Country icon" />
        <input
          :class="['form__input', { 'form__input--error': errorFields?.country?.length && touched.country }]"
          id="country"
          v-model.trim="user.country"
          type="text"
          :placeholder="INPUTS_USER_ADDRESS.country.placeholder"
          @blur="markTouched('country')" />
      </div>
      <div class="form__error" v-if="errorFields?.country?.length && touched.country">
        {{ errorFields?.country?.[0]?.message }}
      </div>
    </div>
    <!-- State/Province -->
    <div class="form__block state">
      <label class="form__label" for="state">{{ INPUTS_USER_ADDRESS.state.label }}</label>
      <div class="form__input-wrapper">
        <img
          class="simple-icon"
          v-if="INPUTS_USER_ADDRESS.state.icon"
          :src="INPUTS_USER_ADDRESS.state.icon"
          alt="State/Province icon" />
        <input
          :class="['form__input', { 'form__input--error': errorFields?.state?.length && touched.state }]"
          id="state"
          v-model.trim="user.state"
          type="text"
          :placeholder="INPUTS_USER_ADDRESS.state.placeholder"
          @blur="markTouched('state')" />
      </div>
      <div class="form__error" v-if="errorFields?.state?.length && touched.state">
        {{ errorFields?.state?.[0]?.message }}
      </div>
    </div>
    <!-- ZIP Code -->
    <div class="form__block zip">
      <label class="form__label" for="zip">{{ INPUTS_USER_ADDRESS.zip.label }}</label>
      <div class="form__input-wrapper">
        <img class="simple-icon" v-if="INPUTS_USER_ADDRESS.zip.icon" :src="INPUTS_USER_ADDRESS.zip.icon" alt="ZIP Code icon" />
        <input
          :class="['form__input', { 'form__input--error': errorFields?.zip?.length && touched.zip }]"
          id="zip"
          v-model.trim="user.zip"
          type="text"
          :placeholder="INPUTS_USER_ADDRESS.zip.placeholder"
          @blur="markTouched('zip')" />
      </div>
      <div class="form__error" v-if="errorFields?.zip?.length && touched.zip">
        {{ errorFields?.zip?.[0]?.message }}
      </div>
    </div>
    <!-- City -->
    <div class="form__block city">
      <label class="form__label" for="city">{{ INPUTS_USER_ADDRESS.city.label }}</label>
      <div class="form__input-wrapper">
        <img class="simple-icon" v-if="INPUTS_USER_ADDRESS.city.icon" :src="INPUTS_USER_ADDRESS.city.icon" alt="City icon" />
        <input
          :class="['form__input', { 'form__input--error': errorFields?.city?.length && touched.city }]"
          id="city"
          v-model.trim="user.city"
          type="text"
          :placeholder="INPUTS_USER_ADDRESS.city.placeholder"
          @blur="markTouched('city')" />
      </div>
      <div class="form__error" v-if="errorFields?.city?.length && touched.city">{{ errorFields?.city?.[0]?.message }}</div>
    </div>

    <!-- Street -->
    <div class="form__block street">
      <label class="form__label" for="street">{{ INPUTS_USER_ADDRESS.street.label }}</label>
      <div class="form__input-wrapper">
        <img class="simple-icon" :src="INPUTS_USER_ADDRESS.street.icon" alt="Street icon" />
        <input
          :class="['form__input', { 'form__input--error': errorFields?.street?.length && touched.street }]"
          id="street"
          v-model.trim="user.street"
          type="text"
          :placeholder="INPUTS_USER_ADDRESS.street.placeholder"
          @blur="markTouched('street')" />
      </div>
      <div class="form__error" v-if="errorFields?.street?.length && touched.street">
        {{ errorFields?.street?.[0]?.message }}
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .form {
    flex-wrap: wrap;
    &__block:not(.address) {
      width: calc(100% / 3 - 0.75rem);
    }
    &__block.city {
      width: calc(100% / 3 - 0.75rem);
    }
    &__block.street {
      flex: 1;
    }
  }
  @media screen and (max-width: $breakpoint-md) {
    // 768px
    .form {
      &__block:not(.street) {
        width: calc(100% / 2 - 0.75rem);
      }
    }
  }
  @media screen and (max-width: $breakpoint-sm) {
    // 480px
    .form {
      &__block {
        width: 100% !important;
      }
    }
  }
</style>
