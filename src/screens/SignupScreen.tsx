import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {OtherStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {auth} from '../config/firebase';

type SignupProps = NativeStackScreenProps<OtherStackParamList, 'Signup'>;

const Signup: React.FC<SignupProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
      <TouchableOpacity
        style={styles.signedUpButtonContainer}
        onPress={handleSignup}>
        <Text style={styles.signedUpButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signedUpButtonContainer}
        onPress={goToLogin}>
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
    backgroundColor: '#808080',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  signedUpButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default Signup;
