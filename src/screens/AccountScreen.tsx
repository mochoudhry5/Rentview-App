import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {auth} from '../config/firebase';
import {signOut} from 'firebase/auth';
import {
  collection,
  getDoc,
  doc,
  query,
  DocumentData,
  getDocs,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {AccountStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
    {title: 'Logout', subTitle: 'Get out of RentView', onPress: handleLogout},
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
