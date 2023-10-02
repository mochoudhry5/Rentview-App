import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types"
import ProfileScreen from '../screens/ProfileScreen';
import ActivityScreen from '../screens/ActivityScreen';

const LoggedInStack = createStackNavigator<RootStackParamList>(); 

const OtherStack = () => {
  return (
    <LoggedInStack.Navigator initialRouteName="ProfileScreen">
        <LoggedInStack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown:false, title: "Profile"}}
        />
        <LoggedInStack.Screen
          name="ActivityScreen"
          component={ActivityScreen}
        />
    </LoggedInStack.Navigator>
  )
}

export default OtherStack