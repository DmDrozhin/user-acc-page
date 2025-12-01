<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import type { Rules } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_USER_NAME } from '@/data/designations.ts';
  import AvatarUploader from '@/components/AvatarUploader.vue';

  const user = reactive({ name: '', middleName: '', secondName: '' });
  const touched = reactive({
    name: false,
    middleName: false,
    secondName: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const rules: Rules = {
    name: [{ type: 'string', min: 3, max: 20, required: true, message: 'Name is required' }],
    middleName: [{ type: 'string', min: 3, max: 20, required: false }],
    secondName: [{ type: 'string', min: 3, max: 20, required: true, message: 'Second Name is required' }]
  };

  const { pass, isFinished, errorFields } = useAsyncValidator(user, rules);
  const isValidForm = computed(() => pass.value && isFinished.value);
</script>

<template>
  <form class="form user-name">
    <div class="form__indicator" :class="{ form_ready: isValidForm }"></div>
    <div class="form__column-wrapper avatar">
      <AvatarUploader class="form__avatar-uploader" />
    </div>
    <!-- First, Middle and Second Name -->
    <div class="form__column-wrapper names">
      <div class="form__wrapper">
        <!-- First name -->
        <div class="form__block name">
          <label class="form__label" for="name">{{ INPUTS_USER_NAME.name.label }}</label>
          <div class="form__input-wrapper">
            <img class="simple-icon" v-if="INPUTS_USER_NAME.name.icon" :src="INPUTS_USER_NAME.name.icon" alt="Name icon" />
            <input
              :class="['form__input', { 'form__input--error': errorFields?.name?.length && touched.name }]"
              id="name"
              v-model.trim="user.name"
              type="text"
              :placeholder="INPUTS_USER_NAME.name.placeholder"
              @blur="markTouched('name')" />
          </div>
          <div class="form__error" v-if="errorFields?.name?.length && touched.name">{{ errorFields?.name?.[0]?.message }}</div>
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
      <!-- Second name -->
      <div class="form__block second-name">
        <label class="form__label" for="second-name">{{ INPUTS_USER_NAME.secondName.label }}</label>
        <div class="form__input-wrapper">
          <img
            class="simple-icon"
            v-if="INPUTS_USER_NAME.secondName.icon"
            :src="INPUTS_USER_NAME.secondName.icon"
            alt="Second Name icon" />
          <input
            :class="['form__input', { 'form__input--error': errorFields?.secondName?.length && touched.secondName }]"
            id="second-name"
            v-model.trim="user.secondName"
            type="text"
            :placeholder="INPUTS_USER_NAME.secondName.placeholder"
            @blur="markTouched('secondName')" />
        </div>
        <div class="form__error" v-if="errorFields?.secondName?.length && touched.secondName">
          {{ errorFields?.secondName?.[0]?.message }}
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
