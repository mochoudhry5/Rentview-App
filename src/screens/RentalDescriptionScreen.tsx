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
  ActivityIndicator,
} from 'react-native';
import {
  doc,
  getDoc,
  query,
  onSnapshot,
  collection,
  DocumentData,
  updateDoc,
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

const {width} = Dimensions.get('screen');
const height = width * 0.9;
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

let detailObj = {
  totalBathrooms: '',
  totalBedrooms: '',
  totalSquareFeet: '',
  statusOfRental: '',
  propertyDescription: '',
  rentalArea: '',
  monthlyRent: '',
  furnished: '',
  applianceIncluded: '',
};

const RentalDescription: React.FC<RentalDescriptionProps> = ({
  route,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [yesRecommendation, setYesRecommendation] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [landlordRating, setLandlordRating] = useState<number>(0);
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [allReviews, setAllReviews] = useState<DocumentData[]>([]);
  const [ownerUserId, setOwnerUserId] = useState<string>(route.params.ownerId);
  const [totalSquareFeet, setTotalSquareFeet] = useState<string>('');
  const [totalBathrooms, setTotalBathrooms] = useState<string>('');
  const [totalBedrooms, setTotalBedrooms] = useState<string>('');
  const [rentalArea, setRentalArea] = useState<string>('');
  const [propertyDescription, setPropertyDescription] = useState<string>('');
  const [statusOfRental, setStatusOfRental] = useState<string>('');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [furnished, setFurnished] = useState<string>('');
  const [applianceIncluded, setApplianceIncluded] = useState<string>('');
  const [ownerFullName, setOwnerFullName] = useState<string>('');
  const [active, setActive] = useState(0);
  const [expandedPropInfo, setExpandedPropInfo] = useState<boolean>(false);
  const [expandedOwnerInfo, setExpandedOwnerInfo] = useState<boolean>(false);
  const [currUserReviewed, setCurrUserReviewed] = useState<boolean>(false);
  const user = auth.currentUser;
  const userId = user?.uid ? user.uid : '';
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['3%', '14%', '90%'];
  const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
  const homeReviewsQuery = query(
    collection(db, 'HomeReviews', route.params.homeId, 'IndividualRatings'),
  );

  useEffect(() => {
    const subscriber = onSnapshot(homeInfoRef, docSnapshot => {
      if (docSnapshot.exists()) {
        setTotalReviews(docSnapshot.data().totalReviews);
        setStreet(docSnapshot.data().address.street);
        setCity(docSnapshot.data().address.city);
        setState(docSnapshot.data().address.state);
        setPostalCode(docSnapshot.data().address.postalCode);
        setOverallRating(docSnapshot.data().overallRating.avgOverallRating);
        setYesRecommendation(docSnapshot.data().wouldRecommend.yes);
        setLandlordRating(
          docSnapshot.data().landlordService.avgLandlordService,
        );
        setOwnerUserId(docSnapshot.data().owner.userId);
        setTotalBathrooms(docSnapshot.data().totalBathrooms);
        setTotalBedrooms(docSnapshot.data().totalBedrooms);
        setTotalSquareFeet(docSnapshot.data().totalSquareFeet);
        setPropertyDescription(docSnapshot.data().propertyDescription);
        setStatusOfRental(docSnapshot.data().statusOfRental);
        setRentalArea(docSnapshot.data().rentalArea);
        setMonthlyRent(docSnapshot.data().monthlyRent);
        setFurnished(docSnapshot.data().furnished);
        setApplianceIncluded(docSnapshot.data().applianceIncluded);
      }
      setIsLoading(false);
    });
    return () => subscriber();
  }, []);

  useEffect(() => {
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
    return () => getData();
  }, []);

  const handleClaimHome = async () => {
    const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);

    if (homeInfoSnapshot.exists()) {
      await updateDoc(homeInfoRef, {
        owner: {
          userId: userId,
        },
      });
      const homeInfoSnapshotUpdate = await getDoc(homeInfoRef);
      if (homeInfoSnapshotUpdate.exists()) {
        setOwnerUserId(homeInfoSnapshotUpdate.data().owner.userId);
      }
    }
  };

  const handleEdit = async () => {
    const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);
    if (homeInfoSnapshot.exists()) {
      const refData = homeInfoSnapshot.data();
      (detailObj.totalBathrooms = refData.totalBathrooms),
        (detailObj.totalBedrooms = refData.totalBedrooms),
        (detailObj.totalSquareFeet = refData.totalSquareFeet),
        (detailObj.statusOfRental = refData.statusOfRental),
        (detailObj.propertyDescription = refData.propertyDescription),
        (detailObj.monthlyRent = refData.monthlyRent),
        (detailObj.furnished = refData.furnished),
        (detailObj.applianceIncluded = refData.applianceIncluded),
        (detailObj.rentalArea = refData.rentalArea);
    }
    navigation.navigate('RentalPostScreen', {
      homeId: route.params.homeId,
      homeDetails: detailObj,
    });
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

  const handleCreateReview = () => {
    navigation.navigate('CreateReview', {homeId: route.params.homeId});
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
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
                  <Image
                    key={image}
                    source={{uri: image}}
                    style={styles.image}
                  />
                ))}
              </ScrollView>
              {userId === ownerUserId ? (
                <View style={styles.editButton}>
                  <TouchableOpacity
                    style={styles.roundButton1}
                    onPress={handleEdit}>
                    <Text style={{paddingLeft: '5%', paddingRight: '5%'}}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : ownerUserId === '' ? (
                <View style={styles.claimButton}>
                  <TouchableOpacity
                    style={styles.roundButton1}
                    onPress={handleClaimHome}>
                    <Text style={{paddingLeft: '2%', paddingRight: '2%'}}>
                      Claim Home
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.alreadyClaimedButton}>
                  <TouchableOpacity style={styles.roundButton1} disabled={true}>
                    <Text style={{paddingLeft: '1%', paddingRight: '1%'}}>
                      Already Claimed
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.backButton}>
                <TouchableOpacity
                  style={styles.roundButton1}
                  onPress={() => navigation.goBack()}>
                  <Icon name={'chevron-back-outline'} color="black" size={30} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: '3%',
                  paddingLeft: '3%',
                  marginTop: '1%',
                }}>
                {monthlyRent !== '' ? (
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: 'bold',
                      paddingRight: '3%',
                    }}>
                    ${monthlyRent}/month
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 23,
                      fontWeight: 'bold',
                    }}>
                    Monthly Rent: N/A
                  </Text>
                )}
                <View
                  style={{
                    backgroundColor: '#1f3839',
                    borderRadius: 5,
                    alignSelf: 'center',
                  }}>
                  {rentalArea !== '' ? (
                    <Text
                      style={{
                        padding: '1%',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      {rentalArea}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        padding: '1%',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      Type: N/A
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.addressLine2}>
                <MaterialIcon name="map-marker" color={'gray'} size={15} />
                {street},{city},{state}, {postalCode}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: '2%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F7F7F7',
                    borderRadius: 7,
                  }}>
                  <Icon
                    name="home-outline"
                    size={25}
                    style={{paddingLeft: '3%'}}
                  />
                  {totalSquareFeet !== '' ? (
                    <Text
                      style={{
                        fontSize: 15,
                        paddingLeft: '2%',
                        paddingRight: '3%',
                      }}>
                      {totalSquareFeet} sqft.
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 15,
                        paddingLeft: '2%',
                        paddingRight: '3%',
                      }}>
                      N/A
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F7F7F7',
                    borderRadius: 7,
                  }}>
                  <MaterialIcon
                    name="bathtub-outline"
                    size={30}
                    style={{paddingLeft: '3%'}}
                  />
                  {totalBathrooms !== '' ? (
                    <Text
                      style={{
                        fontSize: 15,
                        paddingLeft: '2%',
                        paddingRight: '3%',
                      }}>
                      {totalBathrooms} Bath
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 15,
                        paddingLeft: '2%',
                        paddingRight: '3%',
                      }}>
                      N/A
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F7F7F7',
                    borderRadius: 7,
                  }}>
                  <Icon
                    name="bed-outline"
                    size={30}
                    style={{paddingLeft: '3%'}}
                  />
                  {totalBedrooms !== '' ? (
                    <Text
                      style={{
                        fontSize: 15,
                        paddingLeft: '2%',
                        paddingRight: '3%',
                      }}>
                      {totalBedrooms} Beds
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 15,
                        paddingLeft: '2%',
                        paddingRight: '3%',
                      }}>
                      N/A
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '4%',
                paddingLeft: '4%',
              }}>
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                Rental Status:
              </Text>
              <View style={styles.status}>
                <TouchableOpacity
                  style={styles.roundButton2}
                  onPress={handleEdit}>
                  {statusOfRental === 'Available' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingLeft: '2%',
                      }}>
                      <View style={styles.AvailableStatus} />
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          padding: '1%',
                        }}>
                        {statusOfRental}
                      </Text>
                    </View>
                  ) : statusOfRental === 'Not Renting' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingLeft: '2%',
                      }}>
                      <View style={styles.notRentingStatus} />
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          padding: '1%',
                        }}>
                        {statusOfRental}
                      </Text>
                    </View>
                  ) : statusOfRental === 'Occupied' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingLeft: '2%',
                      }}>
                      <View style={styles.occupiedStatus} />
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          padding: '1%',
                        }}>
                        {statusOfRental}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingLeft: '2%',
                      }}>
                      <View style={styles.unknownStatus} />
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          padding: '1%',
                        }}>
                        Unknown
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <ListItem.Accordion
              content={
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      fontSize: 17,
                      color: 'black',
                      fontWeight: 'bold',
                      marginTop: '3%',
                    }}>
                    Property Information
                  </ListItem.Title>
                </ListItem.Content>
              }
              isExpanded={expandedPropInfo}
              onPress={() => {
                setExpandedPropInfo(!expandedPropInfo);
              }}>
              <ListItem containerStyle={{paddingTop: 0, paddingBottom: 0}}>
                <ListItem.Content>
                  <View style={styles.rentalInfo}>
                    <View style={{width: '100%'}}>
                      {applianceIncluded !== '' ? (
                        <Text>
                          <Text
                            style={{fontWeight: 'bold', textAlign: 'center'}}>
                            Washer/Dryer:
                          </Text>{' '}
                          {applianceIncluded}
                        </Text>
                      ) : (
                        <Text>
                          <Text
                            style={{fontWeight: 'bold', textAlign: 'center'}}>
                            Washer/Dryer:
                          </Text>{' '}
                          N/A
                        </Text>
                      )}
                      {furnished !== '' ? (
                        <Text>
                          <Text
                            style={{fontWeight: 'bold', textAlign: 'center'}}>
                            Furnished:
                          </Text>{' '}
                          {furnished}
                        </Text>
                      ) : (
                        <Text>
                          <Text
                            style={{fontWeight: 'bold', textAlign: 'center'}}>
                            Furnished:
                          </Text>{' '}
                          N/A
                        </Text>
                      )}
                    </View>
                  </View>
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>
            <ListItem.Accordion
              content={
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      fontSize: 17,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    Owner Details
                  </ListItem.Title>
                </ListItem.Content>
              }
              isExpanded={expandedOwnerInfo}
              onPress={() => {
                setExpandedOwnerInfo(!expandedOwnerInfo);
              }}>
              <ListItem containerStyle={{paddingTop: 0, paddingBottom: 0}}>
                <ListItem.Content>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      Name:
                    </Text>
                    <Text style={{fontSize: 15, paddingLeft: '1%'}}>
                      {ownerFullName}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.submitButton}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      Message
                    </Text>
                  </TouchableOpacity>
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
                    <Text style={styles.rating}>
                      {overallRating.toFixed(1)}
                    </Text>
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
                            onPress={handleCreateReview}>
                            <Text style={{color: 'blue'}}>Add Review</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleCreateReview}>
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
                  style={{
                    paddingTop: '5%',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        marginTop: '1%',
                      }}
                      source={{
                        uri: 'https://source.unsplash.com/1024x768/?user',
                      }}
                    />
                    <Text
                      style={{
                        paddingLeft: '1%',
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
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
                    <Text
                      style={{color: 'gray', fontSize: 11, paddingLeft: '2%'}}>
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
        </>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'white',
  },
  rentalInfo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'space-evenly',
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
    marginBottom: '2%',
  },
  addressLine1: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22,
  },
  addressLine2: {
    paddingLeft: '3%',
    fontSize: 14,
    marginBottom: '1%',
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
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    borderRadius: 50,
    padding: 3,
    paddingLeft: '3%',
    paddingRight: '3%',
    alignSelf: 'center',
    justifyContent: 'center',
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
    left: '73%',
    flexDirection: 'row',
    width: 250,
  },
  occupiedStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  AvailableStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'green',
    alignSelf: 'center',
  },
  notRentingStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  unknownStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'gray',
    alignSelf: 'center',
  },
  editButton: {
    position: 'absolute',
    top: '16%',
    left: '78%',
    flexDirection: 'row',
    width: 250,
  },
  status: {
    marginRight: '2%',
  },
  alreadyClaimedButton: {
    position: 'absolute',
    top: '16%',
    left: '67%',
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
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton2: {
    borderRadius: 50,
    padding: '1%',
    backgroundColor: '#F7F7F7',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RentalDescription;
