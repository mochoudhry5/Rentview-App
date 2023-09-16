import React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from "../utils/firebase"
import { signOut } from "firebase/auth";

const ProfileScreen = () => {

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully:');
      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://source.unsplash.com/1024x768/?male" }} style={styles.profilePicture} />
      <Text style={styles.userName}>Momin Choudhry</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Activity</Text>
        </TouchableOpacity> */}
      </View>
      <View style={{}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Start from the top
    alignItems: 'center',
    paddingTop: 50, // Add paddingTop to push the content down from the top
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
  },
});

export default ProfileScreen;
