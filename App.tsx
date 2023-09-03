import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './components/navigation/AuthNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from './components/HomeView';
import auth from '@react-native-firebase/auth';


const App = () => {
  const user = auth().currentUser;

  return (
    <NavigationContainer>
      {user ? <HomeScreen /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
