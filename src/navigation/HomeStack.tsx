import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeStackParamList} from '../utils/types';
import RentalDescriptionScreen from '../screens/RentalDescriptionScreen';
import CreateReviewScreen from '../screens/CreateReviewScreen';
import NearbyRentalView from '../screens/NearbyRentalsScreen';
import RentalPostScreen from '../screens/RentalPostScreen';

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
        options={{
          title: 'Post Review',
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        }}
        component={CreateReviewScreen}
      />
      <Stack.Screen
        name="RentalPostScreen"
        options={{
          title: 'Edit Your Rental',
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        }}
        component={RentalPostScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
