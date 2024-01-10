import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import {OtherStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {auth} from '../config/firebase';
import {configureGoogle, signInGoogle} from '../config/googleConfig';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '../config/firebase';

configureGoogle();

type LoginProps = NativeStackScreenProps<OtherStackParamList, 'Login'>;

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await addUserToDb();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signinWithGoogle = async () => {
    const {idToken} = await signInGoogle.signIn();
    const googleCredential = GoogleAuthProvider.credential(idToken);

    await signInWithCredential(auth, googleCredential);

    if (auth.currentUser !== null) {
      await addUserToDb();
    }
  };

  const addUserToDb = async () => {
    let userId = auth.currentUser ? auth.currentUser.uid : '';
    const userInfoRef = doc(db, 'UserReviews', userId);
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (!userInfoSnapshot.exists()) {
      await setDoc(doc(db, 'UserReviews', userId), {
        username: null,
        fullName: null,
        email: auth.currentUser?.email,
        phoneNumber: null,
        recentSearchs: null,
      });
    }
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
        onPress={handleLogin}>
        <Text style={styles.signedUpButtonText}>Log In</Text>
      </TouchableOpacity>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        <View>
          <Text style={{width: 50, textAlign: 'center'}}>or</Text>
        </View>
        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
      </View>
      <TouchableOpacity style={styles.googleButton} onPress={signinWithGoogle}>
        <Image
          style={styles.googleIcon}
          source={{
            uri: 'https://i.ibb.co/j82DCcR/search.png',
          }}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
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
  googleButton: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 34,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  googleIcon: {
    height: 24,
    width: 24,
  },
});

export default Login;
