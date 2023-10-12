import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from "../config/firebase"
import { signOut } from "firebase/auth";
import { collection, getDoc, doc, query, DocumentData, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';
import { AccountStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type AccountProps = NativeStackScreenProps<AccountStackParamList, "AccountScreen">;

const AccountScreen : React.FC<AccountProps> = ({ navigation }) => {
  const userId = auth.currentUser ? auth.currentUser.uid : "";
  const [allReviews, setAllReviews] = useState<DocumentData[]>([]); 

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully:');
      })
      .catch((error) => {
        console.log('Error logging out: ', error);
      });
  };

  const handleActivity = async () => {
    const allReviewsRef = query(collection(db, "UserReviews", userId, "Reviews"));
    const querySnapshot = await getDocs(allReviewsRef);

    setAllReviews([]);

    querySnapshot.forEach((doc) => {
      setAllReviews((prevArr) => ([...prevArr, doc.data()]));
    });
    navigation.navigate("ActivityScreen", { reviews: allReviews });
  }

  const handleProfile = async () => {
    const docRef = doc(db, "UserReviews", userId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      navigation.navigate("ProfileScreen", { userId : docRef.id });
    }
  }

  const settingsOptions = [
    {title: 'Profile', subTitle: 'Manage your RentView profile', onPress : handleProfile },
    {title: 'Notifications', subTitle: 'Turn on/off Notifications', onPress: () => {}},
    {title: 'Activity', subTitle: 'Manage your reviews', onPress : handleActivity},
    {title: 'Logout', subTitle: 'Get out of RentView', onPress : handleLogout},
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
      <Image source={{ uri: "https://source.unsplash.com/1024x768/?rent" }} style={styles.profilePicture} />
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '15%',
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

export default AccountScreen;