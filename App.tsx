import React, {useState, useEffect} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
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
import ChatScreen from './src/screens/ChatScreen';

const App = () => {
  const [user, setUser] = useState<User | null>();
  const Stack = createStackNavigator<OtherStackParamList>();

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

function LoggedInLayout() {
  const Tab = createBottomTabNavigator();
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
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }
          return <Icon name={iconName} color="#1f3839" size={36} />;
        },
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (
            routeName === 'RentalDescription' ||
            routeName === 'ProfileScreen' ||
            routeName === 'CreateReview' ||
            routeName === 'ActivityScreen' ||
            routeName === 'PropertiesScreen' ||
            routeName === 'RentalPostScreen'
          ) {
            return {display: 'none'};
          }
          return;
        })(route),

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
        name="Chat"
        component={ChatScreen}
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
