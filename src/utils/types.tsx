import {DocumentData} from 'firebase/firestore';

export type HomeStackParamList = {
  SearchRentals: undefined;
  RentalDescription: {homeId: string; ownerId: string};
  CreateReview: {homeId: string};
  RentalPostScreen: {homeId: string; homeDetails: DocumentData};
};

export type AccountStackParamList = {
  ActivityScreen: undefined;
  AccountScreen: undefined;
  ProfileScreen: {userId: string};
  RentalDescription: {homeId: string; ownerId: string};
  PropertiesScreen: undefined;
  RentalPostScreen: undefined;
};

export type RootStackParamList = {
  Home: HomeStackParamList;
  Account: AccountStackParamList;
};

export type OtherStackParamList = {
  LoggedIn: RootStackParamList;
  Login: undefined;
  Signup: undefined;
};

export type ImageType = {
  uri: string;
};
