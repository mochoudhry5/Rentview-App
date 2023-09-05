import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginView from './src/screens/LoginScreen'
import SignupView from './src/screens/SignupScreen'
import NearbyRentalView  from './src/screens/NearbyRentalsScreen';
import RentalDescription from './src/screens/RentalDescriptionScreen';
import CreateReviewScreen from './src/screens/CreateReviewScreen';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { RootStackParamList, OtherStackParamList } from "./src/utils/types"

const Stack = createStackNavigator<OtherStackParamList>();
const LoggedInStack = createStackNavigator<RootStackParamList>(); 

function LoggedInLayout(){
  return (
      <LoggedInStack.Navigator initialRouteName="NearbyRentals">
        <LoggedInStack.Screen
          name="SearchRentals"
          component={NearbyRentalView}
          options={{ headerShown:false }}
        />
        <LoggedInStack.Screen
          name="RentalDescription"
          component={RentalDescription}
          options={{headerShown:false }}
        />
        <LoggedInStack.Screen
          name="CreateReview"
          component={CreateReviewScreen}
        />
      </LoggedInStack.Navigator>
  )
}

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(); 

  useEffect(() => {
    auth().onAuthStateChanged(userState => {
      setUser(userState);
    });
  }, []);
  
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <>
          <Stack.Screen name="LoggedIn" component={LoggedInLayout} options={{headerShown:false}}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginView} options={{headerShown:false}}/>
            <Stack.Screen name="Signup" component={SignupView} options={{headerShown:false}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
