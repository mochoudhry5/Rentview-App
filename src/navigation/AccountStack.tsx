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
        options={{
          headerShown: true,
          title: 'Account Settings',
        }}
      />
      <Stack.Screen
        name="ActivityScreen"
        component={ActivityScreen}
        options={{
          title: 'Activity',
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="RentalDescription"
        component={RentalDescriptionScreen}
        options={{
          headerShown: false,
          title: 'Property Information',
          headerBackTitle: 'Reviews',
        }}
      />
      <Stack.Screen
        name="PropertiesScreen"
        component={PropertiesScreen}
        options={{
          title: 'My Properties',
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
