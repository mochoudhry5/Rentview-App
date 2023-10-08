import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { AccountStackParamList } from "../utils/types"
import ProfileScreen from '../screens/ProfileScreen';
import AccountScreen from '../screens/AccountScreen';
import ActivityScreen from '../screens/ActivityScreen';

const Stack = createStackNavigator<AccountStackParamList>(); 

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="AccountScreen">
        <Stack.Screen
          name="AccountScreen"
          component={AccountScreen}
          options={{ headerShown:false, title: "Account"}}
        />
        <Stack.Screen
          name="ActivityScreen"
          component={ActivityScreen}
          options={{title: "Activity"}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{title: "Profile"}}
        />
    </Stack.Navigator>
  )
}

export default AccountStack;