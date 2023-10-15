import {DocumentData} from 'firebase/firestore';

export type HomeStackParamList = {
  SearchRentals: undefined;
  RentalDescription: {docId: string};
  CreateReview: {docId: string};
};

export type RentalPostStackParamList = {
  RentalPostScreen: undefined;
};

export type AccountStackParamList = {
  ActivityScreen: {reviews: DocumentData[]};
  AccountScreen: undefined;
  ProfileScreen: {userId: string};
  RentalDescription: {docId: string};
  PropertiesScreen: undefined;
  RentalPostScreen: undefined;
};

export type RootStackParamList = {
  Home: HomeStackParamList;
  Account: AccountStackParamList;
  RentalPost: RentalPostStackParamList;
};

export type OtherStackParamList = {
  LoggedIn: RootStackParamList;
  Login: undefined;
  Signup: undefined;
};
