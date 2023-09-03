// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../LoginView';
import Signup from '../SignupView';
import HomeScreenView from '../HomeView';
import NearbyRentalView from '../NearbyRentalsView';
import SearchRentalView from '../SearchRentalsView';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen
          name="Home"
          component={HomeScreenView}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="NearbyRentals"
          component={NearbyRentalView}
          options={{ title: 'Nearby Rentals' }}
        />
        <Stack.Screen
          name="SearchRentals"
          component={SearchRentalView}
          options={{ title: 'Search for Rental' }}
        />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
