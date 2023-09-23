import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/types"
import ProfileScreen from './ProfileScreen';
import ActivityScreen from './ActivityScreen';

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