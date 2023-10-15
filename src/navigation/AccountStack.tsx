import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AccountStackParamList} from '../utils/types';
import ProfileScreen from '../screens/ProfileScreen';
import AccountScreen from '../screens/AccountScreen';
import ActivityScreen from '../screens/ActivityScreen';
import RentalDescriptionScreen from '../screens/RentalDescriptionScreen';
import PropertiesScreen from '../screens/PropertiesScreen';
import RentalPostScreen from '../screens/RentalPostScreen';

const Stack = createStackNavigator<AccountStackParamList>();

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="AccountScreen">
      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{headerShown: false, title: 'Account'}}
      />
      <Stack.Screen
        name="ActivityScreen"
        component={ActivityScreen}
        options={{title: 'Activity'}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="RentalDescription"
        component={RentalDescriptionScreen}
        options={{
          headerShown: true,
          title: 'Property Information',
          headerBackTitle: 'Reviews',
        }}
      />
      <Stack.Screen
        name="PropertiesScreen"
        component={PropertiesScreen}
        options={{title: 'My Properties'}}
      />
      <Stack.Screen
        name="RentalPostScreen"
        component={RentalPostScreen}
        options={{title: 'Post Rental'}}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
