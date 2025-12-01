import { createAssetMap } from '@/utils/utils';
const icons = import.meta.glob<{ default: string }>('@/assets/icons/*', {
  eager: true
});
const iconsMap = createAssetMap(icons);

// Form input Header designations
interface AccPageHeader {
  title: string;
  subtitle: string;
  description: string;
  iconStatic?: string;
  iconEdit?: string;
}
export const ACCOUNT_PAGE_HEADER: AccPageHeader = {
  title: 'User Account Page',
  subtitle: 'Manage Your Account Settings',
  description: 'A page to manage user account settings and information.',
  iconStatic: iconsMap['account-lock-open.svg'],
  iconEdit: iconsMap['account-lock.svg']
};

// Form input validation params User Name
type GenderOptions = 'Not selected' | 'Male' | 'Female' | 'Other';
// Bank Card Type
type paymentSystem = 'visa' | 'mastercard' | 'amex' | 'discover' | 'mir' | 'unionpay' |'unknown';

interface FieldInput {
  icon?: string;
  label?: string;
  placeholder?: string;
  options?: GenderOptions[];
  minimum?: number;
  maximum?: number;
  paymentSystem?: { [key in paymentSystem]: string | undefined };
}
interface InputsUserName {
  name: FieldInput;
  middleName: FieldInput;
  secondName: FieldInput;
}
export const INPUTS_USER_NAME: InputsUserName = {
  name: {
    icon: iconsMap['account.svg'],
    label: 'Name *',
    placeholder: 'Name'
  },
  middleName: {
    icon: '',
    label: 'Middle Name',
    placeholder: 'Middle Name'
  },
  secondName: {
    icon: iconsMap['account-plus.svg'],
    label: 'Second Name *',
    placeholder: 'Second Name'
  }
};

// Form input validation params User Avatar
interface InputsUserAvatar {
  email: FieldInput;
  phone: FieldInput;
  birthDate: FieldInput;
  gender: FieldInput;
}
export const INPUTS_USER_META: InputsUserAvatar = {
  email: {
    icon: iconsMap['mail.svg'],
    label: 'Email',
    placeholder: 'Email'
  },
  phone: {
    icon: iconsMap['phone.svg'],
    label: 'Phone Number *',
    placeholder: 'Phone Number'
  },
  birthDate: {
    icon: iconsMap['calendar-range.svg'],
    label: 'Date of Birth',
    placeholder: 'Date of Birth'
  },
  gender: {
    icon: iconsMap['gender-male-female.svg'],
    label: 'Gender',
    placeholder: 'Select Gender',
    options: ['Not selected', 'Male', 'Female', 'Other']
  }
};

// Form input validation params User Address
interface InputsUserAddress {
  country: FieldInput;
  zip: FieldInput;
  city: FieldInput;
  address: FieldInput;
}
export const INPUTS_USER_ADDRESS: InputsUserAddress = {
  country: {
    icon: iconsMap['earth.svg'],
    label: 'Country *',
    placeholder: 'Country'
  },
  zip: {
    icon: iconsMap['map-marker-radius.svg'],
    label: 'ZIP Code *',
    placeholder: 'ZIP Code'
  },
  city: {
    icon: iconsMap['city.svg'],
    label: 'City *',
    placeholder: 'City'
  },
  address: {
    icon: iconsMap['home-map-marker.svg'],
    label: 'Address *',
    placeholder: 'Address'
  }
};
interface InputsBankCard {
  cardNumber: FieldInput;
  cardHolder: FieldInput;
  expiry: FieldInput;
  cvv: FieldInput;
  type: FieldInput;
}
export const INPUTS_BANK_CARD_META: InputsBankCard = {
  cardNumber: {
    label: 'Card Number',
    placeholder: '0000 0000 0000 0000',
    icon: iconsMap['credit-card.svg'],

  },
  cardHolder: {
    label: 'Card Holder',
    placeholder: 'Holder Name',
    icon: iconsMap['account.svg']
  },
  expiry: {
    label: 'Expiry Date',
    placeholder: 'MM/YY',
    icon: iconsMap['calendar-clock.svg'],
    maximum: 5
  },
  cvv: {
    label: 'CVV',
    placeholder: '***',
    icon: iconsMap['lock.svg'],
    maximum: 4
  },
  type: {
    label: 'Card Type',
    placeholder: 'Card Type',
    icon: iconsMap['card-dotted.svg'],
    paymentSystem: {
      visa: iconsMap['visa.svg'],
      mastercard: iconsMap['mastercard.svg'],
      amex: iconsMap['american_express.svg'],
      discover: iconsMap['discover_card.svg'],
      mir: iconsMap['mir.svg'],
      unionpay: iconsMap['unionPay.svg'],
      unknown: ''
    }
  }
};
