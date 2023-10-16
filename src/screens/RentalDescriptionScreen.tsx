import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import ImageSlider from './ImageSliderScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../utils/types';
import {
  doc,
  getDoc,
  query,
  onSnapshot,
  collection,
  DocumentData,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {AirbnbRating} from 'react-native-elements';
import {auth} from '../config/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ListItem} from '@rneui/themed';

const images = [
  'https://source.unsplash.com/1024x768/?house',
  'https://source.unsplash.com/1024x768/?interior',
  'https://source.unsplash.com/1024x768/?backyard',
  'https://source.unsplash.com/1024x768/?garage',
];

type RentalDescriptionProps = NativeStackScreenProps<
  HomeStackParamList,
  'RentalDescription'
>;

const RentalDescription: React.FC<RentalDescriptionProps> = ({
  route,
  navigation,
}) => {
  const [totalReviews, setTotalReviews] = useState(0);
  const [yesRecommendation, setYesRecommendation] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [landlordRating, setLandlordRating] = useState(0);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [allReviews, setAllReviews] = useState<DocumentData[]>([]);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['3%', '14%', '90%'];
  const homeInfoRef = doc(db, 'HomeReviews', route.params.docId);
  const homeReviewsRef = query(
    collection(db, 'HomeReviews', route.params.docId, 'IndividualRatings'),
  );
  const user = auth.currentUser;
  const [expandedPropertyInfo, setExpandedPropertyInfo] = React.useState(false);
  const [expandedOwnerInfo, setExpandedOwnerInfo] = React.useState(false);
  const handlePressPropertyInfo = () =>
    setExpandedPropertyInfo(!expandedPropertyInfo);
  const handlePressOwnerInfo = () => setExpandedOwnerInfo(!expandedOwnerInfo);
  const [currentUserReviewed, setCurrentUserReviewed] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    const subscriber = onSnapshot(homeInfoRef, docSnapshot => {
      if (docSnapshot.exists()) {
        setTotalReviews(docSnapshot.data().totalReviews);
        setOverallRating(docSnapshot.data().overallRating.avgOverallRating);
        setYesRecommendation(docSnapshot.data().wouldRecommend.yes);
        setLandlordRating(
          docSnapshot.data().landlordService.avgLandlordService,
        );
      }
      getData();
    });

    const getData = () => {
      onSnapshot(homeReviewsRef, docSnapshot => {
        if (docSnapshot.size >= 1) {
          setAllReviews([]);
          docSnapshot.forEach(doc => {
            if (doc.data().reviewerEmail === user?.email) {
              setCurrentUserReviewed(true);
            }
            setAllReviews(prevArr => [...prevArr, doc.data()]);
          });
        }
      });
    };

    return () => subscriber();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(homeInfoRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTotalReviews(data.totalReviews);
          setStreet(data.address.street);
          setCity(data.address.city);
          setState(data.address.state);
          setPostalCode(data.address.postalCode);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleOnPress = () => {
    navigation.navigate('CreateReview', {docId: route.params.docId});
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <ScrollView>
        <ImageSlider images={images}/>
        <View>
          <View style={styles.addressLines}>
            <Text style={styles.addressLine1}>{street}</Text>
            <Text style={styles.addressLine2}>
              {city},{state} {postalCode}
            </Text>
          </View>
        </View>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title style={{fontWeight: 'bold'}}>
                  What's Inside?
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={expandedPropertyInfo}
          onPress={() => {
            setExpandedPropertyInfo(!expandedPropertyInfo);
          }}>
          <ListItem style={{marginTop: -10}}>
            <ListItem.Content
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>2,424</Text>
                <MaterialIcon name="ruler" size={30} />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>1</Text>
                <MaterialIcon name="toilet" size={30} />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 18, paddingRight: '1%'}}>2</Text>
                <MaterialIcon name="bed" size={30} />
              </View>
            </ListItem.Content>
          </ListItem>
        </ListItem.Accordion>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title style={{fontWeight: 'bold'}}>
                  Owner Information
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={expandedOwnerInfo}
          onPress={() => {
            setExpandedOwnerInfo(!expandedOwnerInfo);
          }}>
          <ListItem style={{marginTop: -10}}>
            <ListItem.Content>
              <Text>PLACEHOLDER</Text>
            </ListItem.Content>
          </ListItem>
        </ListItem.Accordion>
      </ScrollView>
      <BottomSheet
        style={styles.bottomSheetShadow}
        ref={sheetRef}
        snapPoints={snapPoints}
        index={1}>
        <BottomSheetScrollView>
          <View style={styles.inlineContainer}>
            {totalReviews > 0 && overallRating > 0 ? (
              <>
                <Text style={styles.rating}>{overallRating.toFixed(1)}</Text>
                <Icon name="star" color="black" size={28} />
              </>
            ) : (
              <Text style={[styles.rating, {fontSize: 20}]}>
                No Ratings Yet
              </Text>
            )}
            <View style={styles.inlineContainer}>
              <View style={styles.totalRentersContainer}>
                {totalReviews > 0 ? (
                  <>
                    <Text style={styles.renters}>
                      {'('}
                      {totalReviews} Reviews{')'}
                    </Text>
                    {currentUserReviewed ? (
                      <TouchableOpacity
                        disabled
                        style={styles.alreadyReviewButton}>
                        <Text style={{color: 'green', fontSize: 12}}>
                          Already Reviewed ✔
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleOnPress}>
                        <Text style={{color: 'blue'}}>Add Review</Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleOnPress}>
                    <Text
                      style={{
                        position: 'absolute',
                        right: '2%',
                        top: -10,
                        color: 'blue',
                      }}>
                      Add Review
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={styles.miscRating}>
            <View style={styles.inlineContainer}>
              <View style={styles.rating1}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#1f3839',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    width: '60%',
                  }}>
                  Rent Again
                </Text>
                {totalReviews > 0 ? (
                  <Text style={{fontWeight: 'bold', fontSize: 12}}>
                    {((yesRecommendation / totalReviews) * 100).toFixed(0)}%
                  </Text>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}>
                    N/A
                  </Text>
                )}
              </View>
              <View style={styles.rating1}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#1f3839',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    width: '80%',
                  }}>
                  Landlord Rating
                </Text>
                {totalReviews > 0 && landlordRating > 0 ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}>
                    {landlordRating.toFixed(1)}
                  </Text>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}>
                    N/A
                  </Text>
                )}
              </View>
            </View>
          </View>
          {allReviews.map(review => (
            <View
              key={review.reviewerEmail}
              style={{paddingTop: '5%', paddingLeft: '2%', paddingRight: '2%'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    marginTop: '1%',
                  }}
                  source={{uri: 'https://source.unsplash.com/1024x768/?user'}}
                />
                <Text
                  style={{paddingLeft: '1%', fontWeight: 'bold', fontSize: 14}}>
                  {review.reviewerUsername}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AirbnbRating
                  showRating={false}
                  selectedColor="black"
                  defaultRating={review.overallRating}
                  size={10}
                  isDisabled={true}
                />
                <Text style={{color: 'gray', fontSize: 11, paddingLeft: '2%'}}>
                  {review.dateOfReview}
                </Text>
              </View>
              <Text style={{paddingLeft: '1%', paddingRight: '1%'}}>
                {review.additionalComment}
              </Text>
              <View
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.5,
                  paddingTop: '5%',
                }}
              />
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'white',
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
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 30,
    paddingLeft: '5%',
    fontWeight: '600',
  },
  totalRentersContainer: {
    flex: 1,
  },
  reviewDescription: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    fontSize: 14,
  },
  renters: {
    fontSize: 20,
    marginLeft: '2%',
  },
  reviewsSection: {
    marginTop: '2.5%',
    textAlign: 'center',
  },
  houseImage: {
    width: '100%',
    height: '35%',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressLines: {
    width: '100%',
    marginBottom: '1%',
  },
  addressLine1: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22,
  },
  addressLine2: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
  },
  rating1: {
    width: '40%',
    marginLeft: '6%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    top: 5,
    left: 200,
    color: 'blue',
  },
  alreadyReviewButton: {
    position: 'absolute',
    top: 5,
    left: 170,
    color: 'blue',
  },
  miscRating: {
    marginTop: '5%',
  },
});

export default RentalDescription;
