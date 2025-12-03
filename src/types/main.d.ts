type GenderOptions = 'male' | 'female' | 'other' | 'not selected' | '';
type paymentSystem = 'visa' | 'mastercard' | 'amex' | 'discover' | 'mir' | 'unionpay' |'unknown';
interface UserName {
  firstName: string;
  middleName: string;
  lastName: string;
  avatarUrl?: string;
  avatar?: string | null;
}
interface UserMeta {
  email: string;
  phone: string;
  birthDate: string;
  gender: GenderOptions;
}
interface UserAddress {
  street: string;
  state: string;
  country: string;
  zip: string;
  city: string;
}
interface UserCard {
  uuid: string;
  cardNumber: string;
  holderName: string;
  expiry: string;
  cvv?: string | number;
  paySystem?: string;
}
interface Profile {
  uuid: string;
  userName: UserName;
  userMeta: UserMeta;
  userAddress: UserAddress;
  userCard?: userCard;
}
