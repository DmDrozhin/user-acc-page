<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, reactive, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_USER_ADDRESS } from '@/data/designations.ts';

  const user = reactive({ country: '', zip: '', city: '', address: '' });
  const touched = reactive({
    country: false,
    zip: false,
    city: false,
    address: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const rules: Rules = {
    country: [{ type: 'string', min: 3, max: 20, required: true, message: 'Country is required' }],
    zip: [{ type: 'string', min: 3, max: 20, required: true, message: 'ZIP Code is required' }],
    city: [{ type: 'string', min: 3, max: 20, required: true, message: 'City is required' }],
    address: [{ type: 'string', min: 3, max: 100, required: true, message: 'Address is required' }]
  };
  const { pass, isFinished, errorFields } = useAsyncValidator(user, rules);
  const isValidForm = computed(() => pass && isFinished);
</script>

<template>
  <div class="form user-address">
    <div class="form__row-wrapper country-zip-city">
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
    </div>
    <!-- Address -->
    <div class="form__row-wrapper">
      <div class="form__block address">
        <label class="form__label" for="address">{{ INPUTS_USER_ADDRESS.address.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_ADDRESS.address.icon" alt="Address icon" />
          <input
            :class="['form__input', { 'form__input--error': errorFields?.address?.length && touched.address }]"
            id="address"
            v-model.trim="user.address"
            type="text"
            :placeholder="INPUTS_USER_ADDRESS.address.placeholder"
            @blur="markTouched('address')" />
        </div>
        <div class="form__error" v-if="errorFields?.address?.length && touched.address">
          {{ errorFields?.address?.[0]?.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .form {
    flex-wrap: wrap;
  }
  @media screen and (max-width: $breakpoint-md) {
    // 768px
    .form {
      &__row-wrapper.country-zip-city {
        flex-direction: column;
      }
    }
  }
</style>
