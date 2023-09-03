import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreenView from './components/HomeView';
import LoginView from './components/LoginView'
import SignupView from './components/SignupView'
import NearbyRentalView  from './components/NearbyRentalsView';
import SearchRentalView from './components/SearchRentalsView'; 
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';


const Stack = createNativeStackNavigator();
const LoggedInStack = createNativeStackNavigator(); 

function LoggedInLayout(){
  return (
      <LoggedInStack.Navigator initialRouteName="Login">
        <LoggedInStack.Screen
          name="Home"
          component={HomeScreenView}
          options={{ title: 'Home' }}
        />
        <LoggedInStack.Screen
          name="NearbyRentals"
          component={NearbyRentalView}
          options={{ title: 'Nearby Rentals' }}
        />
        <LoggedInStack.Screen
          name="SearchRentals"
          component={SearchRentalView}
          options={{ title: 'Search for Rentals' }}
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
          <Stack.Screen name="LoggedIn" component={LoggedInLayout} options={{headerShown:false}}/>
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
