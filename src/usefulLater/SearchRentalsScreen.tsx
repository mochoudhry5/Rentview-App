// import React, { useState } from 'react'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import axios from 'axios';
// import { StackNavigationProp } from '@react-navigation/stack';

// type SearchRentalsProps = {
//   navigation: StackNavigationProp<any>;
// };

// const SearchRentalView : React.FC<SearchRentalsProps> = ( {navigation } ) => {
//   const [chosenAddress, setChosenAddress] = useState<string | null>();
//   const [postalCode, setPostalCode] = useState<string | null>();  

//   const handleOnPressAddress = (data : string) => {
//     console.log("Ran")
//     navigation.navigate("RentalDescription");
//   }


//   return (
//     <GooglePlacesAutocomplete
//       placeholder='Search...'
//       minLength={2}
//       listViewDisplayed={false} 
//       fetchDetails={true}
//       onPress={(data, details) => {
//         if(data != null){
//           handleOnPressAddress(data.structured_formatting.main_text); 
//         }
//       }}
//       query={{
//           key: 'AIzaSyDMCC2Peu8bQvTkgddfI3OhHe3zTxNoSeU',
//           language: 'en'
//       }}
//       nearbyPlacesAPI='GooglePlacesSearch'
//       debounce={300}
//     />
//   )
// }

// export default SearchRentalView