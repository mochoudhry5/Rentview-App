import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

type LoginScreenProps = {
    navigation: StackNavigationProp<any>;
};

const Login:  React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Navigate to the Home Screen or any other screen you prefer
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.signedUpButtonContainer} onPress={handleLogin}>
          <Text style={styles.signedUpButtonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signedUpButtonContainer} onPress={goToSignup}>
          <Text style={styles.signedUpButtonText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  signedUpButtonContainer: {
    elevation: 1,
    backgroundColor: "#808080",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom:10
  },
  signedUpButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  }
});

export default Login;
