import {DocumentData} from 'firebase/firestore';

export type RentalType = {
  data: DocumentData;
  homeId: string;
};

export type RecentSearchType = {
  homeId: string;
  ownerId: string;
  homePicture: string;
  homeAddress: string;
};

export type EditReviewProps = {
  currentPropertyReview: DocumentData | undefined;
  setOnEdit: (edit: boolean) => void;
};

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
  RentalPostScreen: {homeId: string; homeDetails: DocumentData};
};

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchRentals: {rentals: RentalType[]};
  RentalDescription: {homeId: string; ownerId: string};
  CreateReview: {homeId: string};
  RentalPostScreen: {homeId: string; homeDetails: DocumentData};
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
