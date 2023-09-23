import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from "../utils/firebase"
import { signOut } from "firebase/auth";
import { collection, doc, query, updateDoc, getDoc, DocumentReference, DocumentData, onSnapshot } from "firebase/firestore";
import { db } from '../utils/firebase';
import { RootStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ProfileProps = NativeStackScreenProps<RootStackParamList, "ProfileScreen">;

const ProfileScreen : React.FC<ProfileProps> = ({ navigation }) => {
  const user = auth.currentUser;
  const [allReviews, setAllReviews] = useState<DocumentData[]>([]); 

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully:');
      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  const handleActivity = async () => {
    if(user){
      let email = user.email ? user.email : "No User"
      console.log(email)
      const docRefSecond = query(collection(db, "UserReviews", email, "Reviews"));

      onSnapshot(docRefSecond, (docSnapshot) => {
        setAllReviews([]);
        if(docSnapshot.size >= 1){
          docSnapshot.forEach((doc) => {
            setAllReviews((prevArr) => ([...prevArr, doc.data()]));
          });
        }
      });
      navigation.navigate("ActivityScreen", {reviews: allReviews});
    }
  }

  const settingsOptions = [
    {title: 'Profile', subTitle: 'Manage your RentView profile', onPress: () => {}},
    {title: 'Notifications', subTitle: 'Turn on/off Notifications', onPress: () => {}},
    {title: 'Activity', subTitle: 'Manage your reviews', onPress : handleActivity},
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
