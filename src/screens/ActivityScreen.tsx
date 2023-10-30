import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {AccountStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import EditReviewScreen from './EditReviewScreen';
import {DocumentData, doc, getDoc} from 'firebase/firestore';
import {db} from '../config/firebase';

type MyReviewProps = NativeStackScreenProps<
  AccountStackParamList,
  'ActivityScreen'
>;

const MyReviews: React.FC<MyReviewProps> = ({route, navigation}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [currentProperty, setCurrentProperty] = useState<DocumentData>();
  const snapPoints = ['1%', '100%'];

  const handleSheetChanges = useCallback((index: number) => {
    if (index == 0) {
      if (sheetRef.current) {
        sheetRef.current.close();
      }
      setOnEdit(false);
    }
  }, []);

  const handleEditReview = (review: DocumentData) => {
    setCurrentProperty(review);
    setOnEdit(true);
  };

  const handleViewProperty = async (homeId: string) => {
    const homeInfoRef = doc(db, 'HomeReviews', homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);
    let ownerId = '';
    if (homeInfoSnapshot.exists()) {
      ownerId = homeInfoSnapshot.data().owner.userId;
    }
    navigation.navigate('RentalDescription', {
      homeId: homeId,
      ownerId: ownerId,
    });
  };

  return route.params.reviews.length > 0 ? (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{flex: 1}}>
        {route.params.reviews.map(review => (
          <View key={review.reviewId}>
            <View style={{marginTop: '3%'}}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                {review.review.address.fullAddress}
              </Text>
              <View
                style={{
                  paddingTop: '2%',
                  paddingLeft: '2%',
                  paddingRight: '2%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: '0%',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}>
                  <TouchableOpacity
                    style={styles.viewProperty}
                    onPress={() => {
                      handleViewProperty(review.review.homeId);
                    }}>
                    <Text style={{fontWeight: 'bold', color: '#424242'}}>
                      View Property
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editReview}
                    onPress={() => {
                      handleEditReview(review);
                    }}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                      View / Edit
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: '5%',
                  }}>
                  <Text
                    style={{color: 'gray', fontSize: 12, paddingLeft: '2%'}}>
                    {review.review.dateOfReview}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5,
                    paddingTop: '1%',
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {onEdit ? (
        <BottomSheet
          style={styles.bottomSheetShadow}
          ref={sheetRef}
          snapPoints={snapPoints}
          index={1}
          onChange={handleSheetChanges}>
          <BottomSheetScrollView>
            <EditReviewScreen currentProperty={currentProperty} />
          </BottomSheetScrollView>
          <SafeAreaView style={{width:'100%', height:'15%', justifyContent:'center', borderTopWidth:.2, borderColor:'gray'}}>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                Update Review
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </BottomSheet>
      ) : null}
    </View>
  ) : (
    <View style={styles.noReviewsView}>
      <Text style={{fontSize: 25, opacity: 0.5}}>No Reviews</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewProperty: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: '30%',
    height: 25,
    aligxnSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  editReview: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width: '30%',
    height: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  inlineContainer: {
    alignItems: 'center',
    borderRadius: 20,
  },
  bottomSheetShadow: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  noReviewsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width: '92%',
    height: '35%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom:'10%'
  },
});
export default MyReviews;
