import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginView from './src/screens/LoginScreen';
import SignupView from './src/screens/SignupScreen';
import HomeStack from './src/navigation/HomeStack';
import {OtherStackParamList} from './src/utils/types';
import {auth} from './src/config/firebase';
import {onAuthStateChanged, User} from 'firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountStack from './src/navigation/AccountStack';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator<OtherStackParamList>();

function LoggedInLayout() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconName: string = '';
          if (route.name === 'Home') {
            iconName = focused ? 'navigate-circle' : 'navigate-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          return <Icon name={iconName} color="black" size={36} />;
        },
        tabBarLabel: () => {
          return null;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={AccountStack}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="LoggedIn"
            component={LoggedInLayout}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginView}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={SignupView}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
