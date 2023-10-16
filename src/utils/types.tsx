import {DocumentData} from 'firebase/firestore';

export type HomeStackParamList = {
  SearchRentals: undefined;
  RentalDescription: {homeId: string};
  CreateReview: {homeId: string};
};

export type AccountStackParamList = {
  ActivityScreen: {reviews: DocumentData[]};
  AccountScreen: undefined;
  ProfileScreen: {userId: string};
  RentalDescription: {homeId: string};
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
