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

interface FieldInput {
  icon?: string;
  label?: string;
  placeholder?: string;
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
    label: 'Second Name',
    placeholder: 'Second Name'
  },
  email: {
    icon: iconsMap['mail.svg'],
    label: 'Email *',
    placeholder: 'Email'
  },
  phone: {
    icon: iconsMap['phone.svg'],
    label: 'Phone Number *',
    placeholder: 'Phone Number'
  }
  // age: {
  //   icon: iconsMap['calendar-range.svg'],
  //   label: 'Age',
  //   placeholder: 'Age'
  // }
};
