// import React from 'react';
// import { View, StyleSheet, Button } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import auth from '@react-native-firebase/auth';
// import { RootStackParamList } from "../utils/types"



// const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

//   const navigateToNearbyRentals = () => {
//     if(navigation != undefined)
//     {
//       navigation.navigate('NearbyRentals');
//     }
//   };

//   const navigateToSearchRentals = () => {
//     if(navigation != undefined)
//     {
//       navigation.navigate('SearchRentals')
//     }
//   }
//   return (
//     <View style={styles.container}>
//       <Button
//         title="View Nearby Rentals"
//         onPress={navigateToNearbyRentals}
//       />
//      <Button
//         title="Search for Rentals"
//         onPress={navigateToSearchRentals}
//       />
//       <Button
//         title="Sign out"
//         onPress={() => auth().signOut()}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;