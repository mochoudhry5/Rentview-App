import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types"
import ProfileScreen from '../screens/ProfileScreen';
import AccountScreen from '../screens/AccountScreen';
import ActivityScreen from '../screens/ActivityScreen';

const LoggedInStack = createStackNavigator<RootStackParamList>(); 

const OtherStack = () => {
  return (
    <LoggedInStack.Navigator initialRouteName="AccountScreen">
        <LoggedInStack.Screen
          name="AccountScreen"
          component={AccountScreen}
          options={{ headerShown:false, title: "Account"}}
        />
        <LoggedInStack.Screen
          name="ActivityScreen"
          component={ActivityScreen}
          options={{title: "Activity"}}
        />
        <LoggedInStack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{title: "Profile"}}
        />
    </LoggedInStack.Navigator>
  )
}

export default OtherStack