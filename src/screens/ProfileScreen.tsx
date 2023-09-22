import React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

  const settingsOptions = [
    {title: 'Profile', subTitle: 'Manage your RentView profile', onPress: () => {}},
    {title: 'Notifications', subTitle: 'Turn on/off Notifications', onPress: () => {}},
    {title: 'Activity', subTitle: 'Manage your reviews', onPress: () => {},},
    {title: 'Logout', subTitle: 'Get out of RentView', onPress : handleLogout},
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
      <Image source={{ uri: "https://source.unsplash.com/1024x768/?male" }} style={styles.profilePicture} />
      <Text style={styles.userName}>Momin Choudhry</Text>
      {settingsOptions.map(({title, subTitle, onPress}, index) => (
        <TouchableOpacity key={title} onPress={onPress} style={{width:'100%'}}>
          <View
            style={{
              paddingHorizontal: '5%',
              paddingBottom: '5%',
              paddingTop: '5%',
            }}>
            <Text style={{fontSize: 17}}>{title}</Text>
            {subTitle && (
              <Text style={{fontSize: 14, opacity: 0.5, paddingTop: '2%'}}>
                {subTitle}
              </Text>
            )}
          </View>
          <View style={{height: 0.5, backgroundColor: 'gray'}} />
        </TouchableOpacity>
      ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Start from the top
    alignItems: 'center',
    paddingTop: '15%', // Add paddingTop to push the content down from the top
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: '3%',
  },
  userName: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ProfileScreen;
