import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types"
import RentalPostScreen from '../screens/RentalPostScreen';

const LoggedInStack = createStackNavigator<RootStackParamList>(); 

const AccountStack = () => {
  return (
    <LoggedInStack.Navigator initialRouteName="RentalPostScreen">
        <LoggedInStack.Screen
          name="RentalPostScreen"
          component={RentalPostScreen}
          options={{title: "Post Rental"}}
        />
    </LoggedInStack.Navigator>
  )
}

export default AccountStack