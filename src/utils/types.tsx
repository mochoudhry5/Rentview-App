
export type RootStackParamList = {
    NearbyRentals: undefined;
    RentalDescription: { docId: string };
    SearchRentals: undefined;
    CreateReview: {docId: string}; 
};

export type OtherStackParamList = {
    LoggedIn: RootStackParamList
    Login: undefined;
    Signup: undefined; 
    
};


