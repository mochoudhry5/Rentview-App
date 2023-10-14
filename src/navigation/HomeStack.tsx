import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeStackParamList} from '../utils/types';
import RentalDescriptionScreen from '../screens/RentalDescriptionScreen';
import CreateReviewScreen from '../screens/CreateReviewScreen';
import NearbyRentalView from '../screens/NearbyRentalsScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="SearchRentals">
      <Stack.Screen
        name="SearchRentals"
        component={NearbyRentalView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RentalDescription"
        component={RentalDescriptionScreen}
        options={{
          headerShown: false,
          title: 'Property Information',
          headerBackTitle: 'Search',
        }}
      />
      <Stack.Screen
        name="CreateReview"
        options={{title: 'Review Home'}}
        component={CreateReviewScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
