import { DocumentData } from "firebase/firestore";

export type RootStackParamList = {
    NearbyRentals: undefined;
    RentalDescription: { docId: string };
    SearchRentals: undefined;
    CreateReview: {docId: string}; 
    ActivityScreen: {reviews: DocumentData[]}
    AccountScreen: undefined;
    ProfileScreen: {userId: string}; 
    RentalPostScreen: undefined; 
};

export type OtherStackParamList = {
    LoggedIn: RootStackParamList
    Login: undefined;
    Signup: undefined; 
    
};


