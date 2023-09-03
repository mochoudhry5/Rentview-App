import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenProps = {
  navigation?: StackNavigationProp<any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const navigateToNearbyRentals = () => {
    if(navigation != undefined)
    {
      navigation.navigate('NearbyRentals');
    }
  };

  const navigateToSearchRentals = () => {
    if(navigation != undefined)
    {
      navigation.navigate('SearchRentals')
    }
  }
  return (
    <View style={styles.container}>
      <Button
        title="View Nearby Rentals"
        onPress={navigateToNearbyRentals}
      />
     <Button
        title="Search for Rental"
        onPress={navigateToSearchRentals}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;