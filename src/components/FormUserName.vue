<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_USER_NAME } from '@/data/designations.ts';

  const user = reactive({ name: '', secondName: '', email: '', phone: '', age: '' });
  const touched = reactive({
    name: false,
    secondName: false,
    email: false,
    phone: false,
    age: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const minAge = 16;

  const rules: Rules = {
    name: [{ type: 'string', min: 3, max: 20, required: true }],
    secondName: [{ type: 'string', min: 3, max: 20, required: false }],
    age: [{ type: 'number', min: minAge, required: true }],
    phone: [
      { required: true, message: 'Phone number is required' },
      { type: 'string', message: 'Phone number must be a string' },
      { pattern: /^\+?[0-9]{1,4}?[-.\s()]?[0-9]{1,4}[-.\s()]?[0-9]{1,9}$/, message: 'Phone number is not valid' },
      { min: 8, max: 15, message: 'Phone number must be between 8 and 15 characters' }
    ],
    email: [{ type: 'email', required: true, max: 150 }]
  };

  const { pass, isFinished, errorFields } = useAsyncValidator(user, rules);
  watch(isFinished, (val) => {
    console.log('isFinished value', val);
    // Trigger validation on user data change
  });
</script>

<template>
  <div class="flags">
    <div>IS-FINISHED-- {{ isFinished }}</div>
    <div>PASS -- {{ pass }}</div>
  </div>
  <!-- First and Second Name -->
  <div class="user-form user-name form">
    <div class="form__row-wrapper">
      <div class="form__block name">
        <label class="form__label" for="name">{{ INPUTS_USER_NAME.name.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_NAME.name.icon" alt="Name icon" />
          <input
            id="name"
            v-model.trim="user.name"
            :class="['form__input', { 'form__input--error': errorFields?.name?.length && touched.name }]"
            type="text"
            :placeholder="INPUTS_USER_NAME.name.placeholder"
            @blur="markTouched('name')" />
        </div>
        <div class="form__error" v-if="errorFields?.name?.length && touched.name">{{ errorFields?.name?.[0]?.message }}</div>
      </div>

      <div class="form__block second-name">
        <label class="form__label" for="second-name">{{ INPUTS_USER_NAME.secondName.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_NAME.secondName.icon" alt="Second Name icon" />
          <input
            id="second-name"
            v-model.trim="user.secondName"
            :class="['form__input', { 'form__input--error': errorFields?.secondName?.length && touched.secondName }]"
            type="text"
            :placeholder="INPUTS_USER_NAME.secondName.placeholder"
            @blur="markTouched('secondName')" />
        </div>
        <div class="form__error" v-if="errorFields?.secondName?.length && touched.secondName">
          {{ errorFields?.secondName?.[0]?.message }}
        </div>
      </div>
    </div>
    <!-- Email and Phone -->
    <div class="form__row-wrapper">
      <div class="form__block email">
        <label class="form__label" for="email">{{ INPUTS_USER_NAME.email.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_NAME.email.icon" alt="Email icon" />
          <input
            id="email"
            v-model.trim="user.email"
            :class="['form__input', { 'form__input--error': errorFields?.email?.length && touched.email }]"
            type="text"
            :placeholder="INPUTS_USER_NAME.email.placeholder"
            @blur="markTouched('email')" />
        </div>
        <div class="form__error" v-if="errorFields?.email?.length && touched.email">{{ errorFields?.email?.[0]?.message }}</div>
      </div>

      <div class="form__block phone">
        <label class="form__label" for="phone">{{ INPUTS_USER_NAME.phone.label }}</label>
        <div class="form__input-wrapper">
          <img class="simple-icon" :src="INPUTS_USER_NAME.phone.icon" alt="Phone icon" />
          <input
            id="phone"
            v-model.trim="user.phone"
            :class="['form__input', { 'form__input--error': errorFields?.phone?.length && touched.phone }]"
            type="text"
            :placeholder="INPUTS_USER_NAME.phone.placeholder"
            @blur="markTouched('phone')" />
        </div>
        <div class="form__error" v-if="errorFields?.phone?.length && touched.phone">{{ errorFields?.phone?.[0]?.message }}</div>
      </div>
    </div>

    <!-- <div>
      <button :disabled="!pass">Submit</button>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .flags {
    position: absolute;
    top: -2rem;
    right: -1rem;
    display: inline-block;
    border: 1px solid lightblue;
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 2rem;
    margin-top: 1rem;
    font-weight: 600;
    z-index: 10;
    background-color: #ceeccb;
  }
</style>
