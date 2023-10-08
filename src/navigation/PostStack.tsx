import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { RentalPostStackParamList } from "../utils/types"
import RentalPostScreen from '../screens/RentalPostScreen';

const Stack = createStackNavigator<RentalPostStackParamList>(); 

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="RentalPostScreen">
        <Stack.Screen
          name="RentalPostScreen"
          component={RentalPostScreen}
          options={{title: "Post Rental"}}
        />
    </Stack.Navigator>
  )
}

export default AccountStack