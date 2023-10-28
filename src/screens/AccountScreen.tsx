import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  collection,
  getDoc,
  doc,
  query,
  DocumentData,
  getDocs,
} from 'firebase/firestore';
import {auth} from '../config/firebase';
import {signOut} from 'firebase/auth';
import {db} from '../config/firebase';
import {AccountStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Modal} from '../components/Modal';

type AccountProps = NativeStackScreenProps<
  AccountStackParamList,
  'AccountScreen'
>;

type HomeReviewsProps = {
  review: DocumentData;
  reviewId: string;
};
const AccountScreen: React.FC<AccountProps> = ({navigation}) => {
  const userId = auth.currentUser ? auth.currentUser.uid : '';

  const handleLogoutAttempt = () => {
    Alert.alert(
      'Log out?',
      'Unsaved changes will be lost',
      [
        {text:'Cancel', style: 'cancel'},
        {text:'Logout', onPress: (handleLogout), style: 'destructive'}
      ]
    )
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully:');
      })
      .catch(error => {
        console.log('Error logging out: ', error);
      });
  };

  const handleActivity = async () => {
    const allReviewsRef = query(
      collection(db, 'UserReviews', userId, 'Reviews'),
    );
    const allReviewsSnapshot = await getDocs(allReviewsRef);
    let reviews: HomeReviewsProps[] = [];

    allReviewsSnapshot.forEach(doc => {
      const reviewObj = {
        review: doc.data(),
        reviewId: doc.id,
      };
      reviews.push(reviewObj);
    });

    navigation.navigate('ActivityScreen', {reviews: reviews});
  };

  const handleProfile = async () => {
    const userInfoRef = doc(db, 'UserReviews', userId);
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (userInfoSnapshot.exists()) {
      navigation.navigate('ProfileScreen', {userId: userInfoSnapshot.id});
    }
  };

  const handleMyProperties = () => {
    navigation.navigate('PropertiesScreen');
  };

  const settingsOptions = [
    {
      title: 'My Profile',
      subTitle: 'Manage your RentView profile',
      onPress: handleProfile,
    },
    {
      title: 'My Activity',
      subTitle: 'Manage your reviews',
      onPress: handleActivity,
    },
    {
      title: 'My Properties',
      subTitle: 'View my properties',
      onPress: handleMyProperties,
    },
    {
      title: 'Logout',
      subTitle: 'Get out of RentView',
      onPress: handleLogoutAttempt,
    },
  ];

  return (
    <ScrollView style={{flex:1, backgroundColor:'white'}}>
      <View style={styles.container}>
        {settingsOptions.map(({title, subTitle, onPress}, index) => (
          <TouchableOpacity
            key={title}
            onPress={onPress}
            style={{width: '100%'}}>
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
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: '88%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 10,
  },
  input: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '2%',
    borderWidth: 0.3,
    height: 40,
    fontSize: 16,
    textAlignVertical: 'bottom',
    paddingLeft: '2%',
  },
});

export default AccountScreen;
