import { createAssetMap } from '@/utils/utils';
const icons = import.meta.glob<{ default: string }>('@/assets/icons/*', {
  eager: true
});
const iconsMap = createAssetMap(icons);

// Form input Header designations
interface AccPageHeader {
  title: string;
  subtitleView: string;
  subtitleEdit: string;
  iconView?: string;
  iconEdit?: string;
}
export const ACCOUNT_PAGE_HEADER: AccPageHeader = {
  title: 'User Account Page',
  subtitleView: 'View Your Account Information',
  subtitleEdit: 'Manage Your Account Settings',
  iconView: iconsMap['account.svg'],
  iconEdit: iconsMap['account-edit.svg']
};
interface FieldInput<T = unknown> {
  icon?: string;
  label?: string;
  placeholder?: string;
  options?: T[];
  minimum?: number;
  maximum?: number;
  paymentSystem?: { [key in paymentSystem]: string | undefined };
}
interface InputsUserName {
  firstName: FieldInput;
  middleName: FieldInput;
  lastName: FieldInput;
  avatarUrl?: string;
  avatar?: Blob | null | string;
}
export const INPUTS_USER_NAME: InputsUserName = {
  firstName: {
    icon: iconsMap['account.svg'],
    label: 'First Name *',
    placeholder: 'First Name'
  },
  middleName: {
    icon: '',
    label: 'Middle Name',
    placeholder: 'Middle Name'
  },
  lastName: {
    icon: iconsMap['account-plus.svg'],
    label: 'Last Name *',
    placeholder: 'Last Name'
  }
};

// Form input validation params User Avatar
interface InputsUserMeta {
  email: FieldInput;
  phone: FieldInput;
  birthDate: FieldInput;
  gender: FieldInput<GenderOptions>;
}
export const INPUTS_USER_META: InputsUserMeta = {
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
    options: ['male', 'female', 'other', 'not selected']
  }
};

// Form input validation params User Address
interface InputsUserAddress {
  country: FieldInput;
  state: FieldInput;
  zip: FieldInput;
  city: FieldInput;
  street: FieldInput;
}
export const INPUTS_USER_ADDRESS: InputsUserAddress = {
  street: {
    icon: iconsMap['home-map-marker.svg'],
    label: 'Street *',
    placeholder: 'Street'
  },
  state: {
    icon: iconsMap['map-marker.svg'],
    label: 'State/Province',
    placeholder: 'State/Province'
  },
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
// Preview Page designations and icons
interface PreviewPage {
  sectionName: {
    title: string;
    titleIcon?: string;
  };
  sectionMeta: {
    title: string;
    iconInfo?: string;
    iconPhone?: string;
    iconEmail?: string;
    iconBirthDate?: string;
    iconGenderMale?: string;
    iconGenderFemale?: string;
    iconGenderOther?: string;
  };
  sectionAddress: {
    title: string;
    titleIcon?: string;
  };
  sectionCard: {
    title: string;
    titleIcon?: string;
    iconHolder?: string;
    iconNumber?: string;
    iconExpiry?: string;
    iconCvv?: string;
    paySystem: { [key in paymentSystem]: string | undefined };
  };
}
export const PREVIEW_PAGE: PreviewPage = {
  sectionName: {
    title: '',
    titleIcon: iconsMap['account.svg'],
  },
  sectionMeta: {
    title: 'User Info',
    iconInfo: iconsMap['information-variant-circle.svg'],
    iconPhone: iconsMap['phone.svg'],
    iconEmail: iconsMap['mail.svg'],
    iconBirthDate: iconsMap['calendar-range.svg'],
    iconGenderMale: iconsMap['gender-male.svg'],
    iconGenderFemale: iconsMap['gender-female.svg'],
    iconGenderOther: iconsMap['gender-male-female.svg'],
  },
  sectionAddress: {
    title: 'Address Details',
    titleIcon: iconsMap['map-marker-radius.svg'],
  },
  sectionCard: {
    title: 'Bank Card Information',
    titleIcon: iconsMap['credit-card.svg'],
    iconHolder: iconsMap['account.svg'],
    iconNumber: iconsMap['credit-card.svg'],
    iconExpiry: iconsMap['calendar-clock.svg'],
    iconCvv: iconsMap['lock.svg'],
    paySystem: {
      visa: iconsMap['visa.svg'],
      mastercard: iconsMap['mastercard.svg'],
      amex: iconsMap['american_express.svg'],
      discover: iconsMap['discover_card.svg'],
      mir: iconsMap['mir.svg'],
      unionpay: iconsMap['unionPay.svg'],
      unknown: iconsMap['credit-card-outline.svg']
    }
  }
};

export const ACTION_BUTTONS = {
  save: {
    label: 'Save Changes',
    icon: iconsMap['content-save-outline.svg']
  },
  edit: {
    label: 'Edit Profile',
    icon: iconsMap['pencil.svg']
  },
  reset: {
    label: 'Reset All',
    icon: iconsMap['reload.svg']
  },
  cancel: {
    label: 'Cancel',
    icon: iconsMap['cog-off.svg']
  }
};
