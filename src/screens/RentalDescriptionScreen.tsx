import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import {
  doc,
  getDoc,
  query,
  onSnapshot,
  collection,
  DocumentData,
} from 'firebase/firestore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../utils/types';
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

const {width} = Dimensions.get('screen');
const height = width * 0.9;

const RentalDescription: React.FC<RentalDescriptionProps> = ({
  route,
  navigation,
}) => {
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [yesRecommendation, setYesRecommendation] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [landlordRating, setLandlordRating] = useState<number>(0);
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [allReviews, setAllReviews] = useState<DocumentData[]>([]);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['3%', '14%', '90%'];
  const user = auth.currentUser;
  const [expandedPropInfo, setExpandedPropInfo] = useState<boolean>(false);
  const [expandedOwnerInfo, setExpandedOwnerInfo] = useState<boolean>(false);
  const [currUserReviewed, setCurrUserReviewed] = useState<boolean>(false);
  const [active, setActive] = useState(0);
  const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
  const homeReviewsQuery = query(
    collection(db, 'HomeReviews', route.params.homeId, 'IndividualRatings'),
  );

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
      onSnapshot(homeReviewsQuery, docSnapshot => {
        if (docSnapshot.size >= 1) {
          setAllReviews([]);
          docSnapshot.forEach(doc => {
            if (doc.data().reviewerEmail === user?.email) {
              setCurrUserReviewed(true);
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
    navigation.navigate('CreateReview', {homeId: route.params.homeId});
  };

  const onScrollChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <ScrollView>
        <View>
          <ScrollView
            pagingEnabled
            horizontal
            onScroll={onScrollChange}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={{width: width, height}}>
            {images.map(image => (
              <Image key={image} source={{uri: image}} style={styles.image} />
            ))}
          </ScrollView>
          <View style={styles.claimButton}>
            <TouchableOpacity style={styles.roundButton1}>
              <Text>Claim Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.backButton}>
            <TouchableOpacity
              style={styles.roundButton1}
              onPress={() => navigation.goBack()}>
              <Icon name={'chevron-back-outline'} color="black" size={30} />
            </TouchableOpacity>
          </View>
        </View>
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
          isExpanded={expandedPropInfo}
          onPress={() => {
            setExpandedPropInfo(!expandedPropInfo);
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
                    {currUserReviewed ? (
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
  rating: {
    fontSize: 30,
    paddingLeft: '5%',
    fontWeight: '600',
  },
  totalRentersContainer: {
    flex: 1,
  },
  renters: {
    fontSize: 20,
    marginLeft: '2%',
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
  backButton: {
    position: 'absolute',
    top: '14%',
    left: '5%',
    flexDirection: 'row',
    width: 200,
  },
  claimButton: {
    position: 'absolute',
    top: '16%',
    left: '74%',
    flexDirection: 'row',
    width: 250,
  },
  dot: {
    color: 'white',
    fontSize: 13,
  },
  activeDot: {
    color: 'black',
    fontSize: 13,
  },
  image: {
    width: width,
    height: height,
    borderColor: 'black',
    borderWidth: 1,
  },
  roundButton1: {
    borderRadius: 50,
    padding: '2%',
    backgroundColor: '#D3D3D3',
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RentalDescription;
