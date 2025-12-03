<!-- src/components/FormUserBankCard.vue -->
<script setup lang="ts">
  import { reactive, computed, watch } from 'vue';
  import type { Rules } from 'async-validator';
  import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
  import { INPUTS_BANK_CARD_META } from '@/data/designations';
  import { getImagePath, formatCardNumber } from '@/utils/utils';
  import MaskedInput from '@/components/MaskedInput.vue';
  import cardValidator from 'card-validator';

  interface Props {
    options?: UserCard | null;
    resetKey: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    options: null,
    resetKey: 0
  });

  const emit = defineEmits<{
    (e: 'update:isValid', value: boolean): void;
    (e: 'update:card', value: typeof card): void;
  }>();

  const card = reactive({
    cardNumber: '',
    holderName: '',
    expiry: '',
    cvv: '',
    paySystem: ''
  });
  const touched = reactive({
    cardNumber: false,
    holderName: false,
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
    (val) => {
      const numberValidation = cardValidator.number(val);
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
  watch(isValidForm, (v) => emit('update:isValid', v), { immediate: true });

  const resetForms = () => {
    // Reset card data
    Object.keys(card).forEach((key) => {
      card[key as keyof typeof card] = '';
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
    card.cardNumber = props.options.cardNumber || '';
    card.holderName = props.options.holderName || '';
    card.expiry = props.options.expiry || '';
    card.cvv = props.options.cvv ? String(props.options.cvv) : '';
    card.paySystem = props.options.paySystem || '';
  };
  // Set initial values on mount
  setInitialValues();
  // Update values when options prop changes
  watch(
    () => props.options,
    () => setInitialValues(),
    { deep: true }
  );
  // Emit card data on changes
  watch(card, (val) => emit('update:card', { ...val }), { deep: true });
</script>

<template>
  <form class="form bank-card" @submit.prevent>
    <div class="form__indicator" :class="{ form_ready: isValidForm }"></div>

    <!-- Card Preview -->
    <div class="form__card-preview">
      <div class="card" :class="'card--' + card.paySystem">
        <div class="card__title">BANK CARD</div>
        <img class="card__pay-system" v-if="paySystemLogo" :src="paySystemLogo || ''" alt="payment system" />
        <div class="card__number">{{ formatCardNumber(card.cardNumber, cardMask) || '**** **** **** ****' }}</div>
        <img class="card__chip" :src="getImagePath('card-chip.png')" alt="bank card chip" />
        <div class="card__expiry">{{ card.expiry || 'MM/YY' }}</div>
        <div class="card__holder">{{ card.holderName || 'HOLDER NAME' }}</div>
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
            id="holderName"
            v-model.trim="card.holderName"
            type="text"
            autocomplete="cc-name"
            :placeholder="INPUTS_BANK_CARD_META.cardHolder.placeholder"
            :class="['form__input', { 'form__input--error': errorFields?.holderName?.length && touched.holderName }]"
            @blur="markTouched('holderName')" />
        </div>
        <div class="form__error" v-if="errorFields?.holderName?.length && touched.holderName">
          {{ errorFields.holderName[0]?.message }}
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
  .card {
    width: 100%;
    max-width: 320px;
    min-height: 200px;
    border-radius: $radius-lg;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: $surface;
    box-shadow: $shadow-lg;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      transition: transform 0.6s;
    }

    &:hover::before {
      transform: translateX(100%);
    }
    &--visa {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    &--mastercard {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    &--amex {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
    &--mir {
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    }
    &--discover {
      background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    }
    &--unionpay {
      background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
    }
    &--unknown {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    &__title {
      font-size: $font-size-md;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.2rem;
      margin-bottom: 0.85rem;
    }
    &__pay-system {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: $font-size-md;
      font-weight: 600;
      text-transform: uppercase;
      opacity: 0.8;
      width: 80px;
      height: 40px;
      object-fit: contain;
    }
    &__chip {
      align-self: flex-end;
      width: 50px;
      height: 40px;
      object-fit: contain;
      margin-bottom: 0.5rem;
    }
    &__number {
      font-size: $font-size-lg;
      font-weight: 600;
      letter-spacing: 0.2rem;
      text-shadow: $text-primary 1px 1px 2px;
    }

    &__holder {
      font-size: $font-size-md;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
    }

    &__expiry {
      font-size: $font-size-md;
      font-weight: 500;
      align-self: flex-end;
      letter-spacing: 0.2rem;
    }
  }
</style>
