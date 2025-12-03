type Avatar = string | null;

interface UserName {
  firstName: string;
  middleName: string;
  lastName: string;
  avatarUrl?: string;
  avatar?: null | string;
}
interface UserMeta {
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
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
