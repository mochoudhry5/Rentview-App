import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types"
import RentalDescriptionScreen from '../screens/RentalDescriptionScreen';
import CreateReviewScreen from '../screens/CreateReviewScreen';
import NearbyRentalView  from '../screens/NearbyRentalsScreen';

const LoggedInStack = createStackNavigator<RootStackParamList>(); 

const HomeStack = () => {
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

export default HomeStack;