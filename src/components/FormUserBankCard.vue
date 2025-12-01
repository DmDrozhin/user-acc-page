<!-- src/components/FormUserBankCard.vue -->
<script setup lang="ts">
  import { reactive, computed, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_BANK_CARD_META } from '@/data/designations';
  import { getImagePath } from '@/utils/utils';
  import MaskedInput from '@/components/MaskedInput.vue';
  import cardValidator from 'card-validator';

  const card = reactive({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    paySystem: '' as string
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

  // Determine mask based on card type
  const cardMask = computed(() => {
    switch (card.paySystem) {
      case 'amex':
        return '#### ###### #####';
      case 'visa':
      case 'mastercard':
      case 'mir':
      case 'discover':
      case 'unionpay':
      default:
        return '#### #### #### ####';
    }
  });

  const cvvMask = computed(() => (card.paySystem === 'amex' ? '####' : '###'));

  // Detect card type using card-validator
  watch(
    () => card.cardNumber,
    (v) => {
      const numberValidation = cardValidator.number(v);
      if (numberValidation.card) {
        card.paySystem = numberValidation.card.type; // 'visa', 'mastercard', 'amex', etc.
      } else {
        card.paySystem = 'unknown';
      }
    }
  );

  // Validation rules using card-validator
  const rules: Rules = {
    cardNumber: [
      { required: true, message: 'Card number is required' },
      {
        validator: (_, value) => {
          const numberValidation = cardValidator.number(value);
          return numberValidation.isValid;
        },
        message: 'Invalid card number'
      }
    ],
    cardHolder: [
      { required: true, message: 'Card holder name is required' },
      { min: 3, max: 50, message: 'Name must be 3-50 characters' }
    ],
    expiry: [
      { required: true, message: 'Expiry is required' },
      {
        validator: (_, value) => cardValidator.expirationDate(value).isValid,
        message: 'Invalid expiry date'
      }
    ],
    cvv: [
      { required: true, message: 'CVV required' },
      {
        validator: (_, value) => cardValidator.cvv(value, card.paySystem === 'amex' ? 4 : 3).isValid,
        message: 'Invalid CVV'
      }
    ]
  };

  const paySystemLogo = computed(() => {
    return (
      INPUTS_BANK_CARD_META.type.paymentSystem?.[card.paySystem as keyof typeof INPUTS_BANK_CARD_META.type.paymentSystem] || ''
    );
  });

  const { pass, isFinished, errorFields } = useAsyncValidator(card, rules);
  const isValidForm = computed(() => pass.value && isFinished.value);
</script>

<template>
  <form class="form bank-card" @submit.prevent>
    <div class="form__indicator" :class="{ form_ready: isValidForm }"></div>

    <!-- Card Preview -->
    <div class="form__card-preview">
      <div class="card" :class="'card--' + card.paySystem">
        <div class="card__title">BANK CARD</div>
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
          <MaskedInput
            id="cardNumber"
            v-model="card.cardNumber"
            :mask="cardMask"
            :placeholder="INPUTS_BANK_CARD_META.cardNumber.placeholder"
            autocomplete="cc-number"
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
            <MaskedInput
              id="expiry"
              v-model="card.expiry"
              mask="##/##"
              placeholder="MM/YY"
              autocomplete="cc-exp"
              :class="['form__input', { 'form__input--error': errorFields?.expiry?.length && touched.expiry }]"
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
            <MaskedInput
              v-model="card.cvv"
              :mask="cvvMask"
              :type="'password'"
              :placeholder="INPUTS_BANK_CARD_META.cvv.placeholder"
              autocomplete="cc-csc"
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
