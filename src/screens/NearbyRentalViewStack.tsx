import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/types"
import RentalDescriptionScreen from './RentalDescriptionScreen';
import CreateReviewScreen from './CreateReviewScreen';
import NearbyRentalView  from './NearbyRentalsScreen';

const LoggedInStack = createStackNavigator<RootStackParamList>(); 

const NearbyRentalViewStack = () => {
  return (
    <LoggedInStack.Navigator initialRouteName="NearbyRentals">
        <LoggedInStack.Screen
          name="SearchRentals"
          component={NearbyRentalView}
          options={{ headerShown:false}}
        />
        <LoggedInStack.Screen
          name="RentalDescription"
          component={RentalDescriptionScreen}
          options={{headerShown:false, title: "Property Information", headerBackTitle: "Search"}}
        />
        <LoggedInStack.Screen
          name="CreateReview"
          options={{title:"Review Home"}}
          component={CreateReviewScreen}
        />
    </LoggedInStack.Navigator>
  )
}

export default NearbyRentalViewStack