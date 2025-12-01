<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { reactive, ref, computed, watch } from 'vue';
  import type { Rules, RuleItem } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_BANK_CARD_META } from '@/data/designations.ts';
  import { getImagePath } from '@/utils/utils.ts';

  interface Props {
    options?: Record<string, unknown>;
  }
  const props = withDefaults(defineProps<Props>(), {
    options: () => ({})
  });

  const card = reactive({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    paySystem: ''
  });

  const touched = reactive({
    cardNumber: false,
    cardHolder: false,
    expiry: false,
    cvv: false
  });

  const markTouched = (field: keyof typeof touched) => {
    touched[field] = true;
  };
  const formatCardNumber = () => {
    const cleaned = card.cardNumber.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    card.cardNumber = formatted;
  };
  const detectCardType = () => {
    const cleaned = card.cardNumber.replace(/\s/g, '');
    if (cleaned.startsWith('4')) {
      card.paySystem = 'visa';
    } else if (cleaned.startsWith('5')) {
      card.paySystem = 'mastercard';
    } else {
      card.paySystem = 'unknown';
    }
  };
  const formatExpiryDate = () => {
    let value = card.expiry.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    card.expiry = value;
  };

  // Validation
  const rules: Rules = {
    cardNumber: [
      { required: true, message: 'Card number is required' },
      { pattern: /^[0-9\s]{12,19}$/, message: 'Invalid card number format' }
      // Pattern explanation: allows 12 to 19 digits with spaces
    ],
    cardHolder: [
      { required: true, message: 'Card holder is required' },
      { min: 3, max: 60, message: 'Card holder name is not valid' }
    ],
    expiry: [
      { required: true, message: 'Expiry date is required' },
      { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Expiry format must be MM/YY' }
      // Pattern explanation: MM/YY format
    ],
    cvv: [
      { required: true, message: 'CVV is required' },
      { pattern: /^[0-9]{3,4}$/, message: 'CVV must be 3 or 4 digits' }
      // Pattern explanation: 3 or 4 digits
    ]
  };
  const paySystemLogo = computed(() => {
    return (
      INPUTS_BANK_CARD_META.type.paymentSystem?.[card.paySystem as keyof typeof INPUTS_BANK_CARD_META.type.paymentSystem] || ''
    );
  });
  const { pass, isFinished, errorFields } = useAsyncValidator(card, rules);
  const isValidForm = computed(() => pass && isFinished);

  const defaultOptions: Record<string, unknown> = {};
  const mainOptions = computed(() => ({
    ...props.options,
    ...defaultOptions
  }));
</script>
<template>
  <form class="form bank-card" @submit.prevent>
    <div class="form__indicator" :class="{ form_ready: pass }"></div>
    <!-- Card Preview -->
    <div class="form__card-preview">
      <div class="card" :class="'card--' + card.paySystem">
        <div class="card__title">CREDIT CARD</div>
        <img class="card__pay-system" v-if="paySystemLogo" :src="paySystemLogo || ''" alt="payment system" />
        <div class="card__number">{{ card.cardNumber || '**** **** **** ****' }}</div>
        <img class="card__chip" :src="getImagePath('card-chip.png')" alt="bank card chip" />
        <div class="card__expiry">{{ card.expiry || 'MM/YY' }}</div>
        <div class="card__holder">{{ card.cardHolder || 'HOLDER NAME' }}</div>
      </div>
    </div>
    <div class="form__column-wrapper">
      <!-- Card Number -->
      <div class="form__block card-number">
        <label class="form__label" for="cardNumber">{{ INPUTS_BANK_CARD_META.cardNumber.label }}</label>
        <div class="form__input-wrapper">
          <img
            v-if="INPUTS_BANK_CARD_META.cardNumber.icon"
            class="simple-icon"
            :src="INPUTS_BANK_CARD_META.cardNumber.icon"
            alt="Card icon" />
          <input
            id="cardNumber"
            v-model.trim="card.cardNumber"
            autocomplete="cc-number"
            type="text"
            @input="
              formatCardNumber();
              detectCardType();
            "
            :placeholder="INPUTS_BANK_CARD_META.cardNumber.placeholder"
            :class="['form__input', { 'form__input--error': errorFields?.cardNumber?.length && touched.cardNumber }]"
            @blur="markTouched('cardNumber')" />
        </div>
        <div class="form__error" v-if="errorFields?.cardNumber?.length && touched.cardNumber">
          {{ errorFields.cardNumber[0]?.message }}
        </div>
      </div>
      <!-- Card Holder -->
      <div class="form__block card-holder">
        <label class="form__label" for="cardHolder">{{ INPUTS_BANK_CARD_META.cardHolder.label }}</label>
        <div class="form__input-wrapper">
          <img
            v-if="INPUTS_BANK_CARD_META.cardHolder.icon"
            class="simple-icon"
            :src="INPUTS_BANK_CARD_META.cardHolder.icon"
            alt="Account icon" />
          <input
            id="cardHolder"
            v-model.trim="card.cardHolder"
            type="text"
            autocomplete="cc-name"
            :placeholder="INPUTS_BANK_CARD_META.cardHolder.placeholder"
            :class="['form__input', { 'form__input--error': errorFields?.cardHolder?.length && touched.cardHolder }]"
            @blur="markTouched('cardHolder')" />
        </div>
        <div class="form__error" v-if="errorFields?.cardHolder?.length && touched.cardHolder">
          {{ errorFields.cardHolder[0]?.message }}
        </div>
      </div>
      <div class="form__wrapper">
        <!-- Expiry -->
        <div class="form__block expiry">
          <label class="form__label" for="expiry">{{ INPUTS_BANK_CARD_META.expiry.label }}</label>
          <div class="form__input-wrapper">
            <img
              v-if="INPUTS_BANK_CARD_META.expiry.icon"
              class="simple-icon"
              :src="INPUTS_BANK_CARD_META.expiry.icon"
              alt="Expiry icon" />
            <input
              id="expiry"
              v-model.trim="card.expiry"
              type="text"
              autocomplete="cc-exp"
              :maxlength="INPUTS_BANK_CARD_META.expiry.maximum"
              :placeholder="INPUTS_BANK_CARD_META.expiry.placeholder"
              :class="['form__input', { 'form__input--error': errorFields?.expiry?.length && touched.expiry }]"
              @input="formatExpiryDate()"
              @blur="markTouched('expiry')" />
          </div>
          <div class="form__error" v-if="errorFields?.expiry?.length && touched.expiry">
            {{ errorFields.expiry[0]?.message }}
          </div>
        </div>
        <!-- CVV -->
        <div class="form__block cvv">
          <label class="form__label" for="cvv">{{ INPUTS_BANK_CARD_META.cvv.label }}</label>
          <div class="form__input-wrapper">
            <img
              v-if="INPUTS_BANK_CARD_META.cvv.icon"
              class="simple-icon"
              :src="INPUTS_BANK_CARD_META.cvv.icon"
              alt="Lock icon" />
            <input
              id="cvv"
              v-model.trim="card.cvv"
              type="password"
              autocomplete="cc-csc"
              :maxlength="INPUTS_BANK_CARD_META.cvv.maximum"
              :placeholder="INPUTS_BANK_CARD_META.cvv.placeholder"
              :class="['form__input', { 'form__input--error': errorFields?.cvv?.length && touched.cvv }]"
              @blur="markTouched('cvv')" />
          </div>
          <div class="form__error" v-if="errorFields?.cvv?.length && touched.cvv">
            {{ errorFields.cvv[0]?.message }}
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<style lang="scss" scoped>
  @use '@/styles/elements.scss' as *;
  .form {
    &__card-preview {
      flex: 1 0 40%;
    }
    &__block.expiry,
    &__block.cvv {
      flex: 1;
    }
  }
  @media screen and (max-width: $breakpoint-md) {
    // 1024px
    .form {
      flex-wrap: wrap;
      &__row-wrapper.number {
        flex: 1;
      }
    }
  }
  #cardHolder {
    text-transform: uppercase;
  }
  #cardNumber {
    letter-spacing: 0.2rem;
  }
</style>
