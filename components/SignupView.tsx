// src/components/Signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

type SignupScreenProps = {
    navigation: StackNavigationProp<any>;
};

const Signup: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      // Navigate to the Home Screen or any other screen you prefer
      navigation.navigate('Home');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
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
      <TouchableOpacity style={styles.signedUpButtonContainer} onPress={handleSignup}>
          <Text style={styles.signedUpButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signedUpButtonContainer} onPress={goToLogin}>
          <Text style={styles.signedUpButtonText}>Already signed up? Log in</Text>
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

export default Signup;
