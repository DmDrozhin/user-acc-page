<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, ref, reactive } from 'vue';
  import AvatarUploader from '@/components/AvatarUploader.vue';
  import type { Rules } from 'async-validator';
  import { INPUTS_USER_NAME } from '@/data/designations.ts';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';

  interface Props {
    options?: Record<string, unknown>;
  }
  const props = withDefaults(defineProps<Props>(), {
    options: () => ({})
  });
  const minAge = 16;

  const user = reactive({ age: '' });
  const touched = reactive({
    age: false
  });
  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };

  const rules: Rules = {
    age: [{ type: 'number', min: minAge, required: true }]
  };
  const { pass, isFinished, errorFields } = useAsyncValidator(user, rules);

  const defaultOptions: Record<string, unknown> = {};
  const mainOptions = computed(() => ({
    ...props.options,
    ...defaultOptions
  }));
</script>

<template>
  <div class="user-form user-avatar form">
    <div class="form__row-wrapper">

      <div class="form__block age">
        <div>
          <label class="form__label" for="age">Age *</label>
          <input
            v-model.number="user.age"
            :class="['form__input', { 'form__input--error': errorFields?.age?.length && touched.age }]"
            type="number"
            :min="minAge"
            placeholder="Age"
            @blur="markTouched('age')" />
          <div class="form__error" v-if="errorFields?.age?.length && touched.age">{{ errorFields?.age?.[0]?.message }}</div>
        </div>
      </div>
      <div>
        <AvatarUploader />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;

</style>

<style lang="scss"></style>
