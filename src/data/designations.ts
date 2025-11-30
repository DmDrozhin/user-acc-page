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
interface FieldInput {
  icon?: string;
  label?: string;
  placeholder?: string;
  options?: GenderOptions[];
  minimum?: number;
  maximum?: number;
}
interface InputsUserName {
  name: FieldInput;
  secondName: FieldInput;
  email: FieldInput;
  phone: FieldInput;
}
export const INPUTS_USER_NAME: InputsUserName = {
  name: {
    icon: iconsMap['account.svg'],
    label: 'Name *',
    placeholder: 'Name'
  },
  secondName: {
    icon: iconsMap['account-plus.svg'],
    label: 'Second Name *',
    placeholder: 'Second Name'
  },
  email: {
    icon: iconsMap['mail.svg'],
    label: 'Email',
    placeholder: 'Email'
  },
  phone: {
    icon: iconsMap['phone.svg'],
    label: 'Phone Number *',
    placeholder: 'Phone Number'
  }
};

// Form input validation params User Avatar
interface InputsUserAvatar {
  birthDate: FieldInput;
  gender: FieldInput;
  age: FieldInput;
}
export const INPUTS_USER_AVATAR: InputsUserAvatar = {
  birthDate: {
    icon: iconsMap['calendar-range.svg'],
    label: 'Date of Birth',
    placeholder: 'Date of Birth',
  },
  gender: {
    icon: iconsMap['gender-male-female.svg'],
    label: 'Gender',
    placeholder: 'Select Gender',
    options: ['Not selected', 'Male', 'Female', 'Other']
  },
  age: {
    icon: iconsMap['account-clock.svg'],
    label: 'Age',
    placeholder: 'Age',
    minimum: 16
  }
};
