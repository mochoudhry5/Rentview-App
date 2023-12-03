import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
  getDoc,
  onSnapshot,
  addDoc,
  and,
} from 'firebase/firestore';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {SearchStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {auth, db} from '../config/firebase';
import {Modal} from '../components/Modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RentalType} from '../utils/types';
import RentalCard from '../components/RentalCard';
import {Card} from '@rneui/base';
import {RecentSearchType} from '../utils/types';

type SearchRentalsProps = NativeStackScreenProps<
  SearchStackParamList,
  'SearchMain'
>;

const SearchMainScreen: React.FC<SearchRentalsProps> = ({navigation}) => {
  const userId = auth.currentUser ? auth.currentUser.uid : '';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fullName, onChangeFullName] = useState<string>('');
  const [username, onChangeUserName] = useState<string>('');
  const [resultsFound, setResultsFound] = useState<boolean>(true);
  const [phoneNumber, onChangePhoneNumber] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<RecentSearchType[]>([]);
  const userInfoRef = doc(db, 'UserReviews', userId);
  const insets = useSafeAreaInsets();
  const searches: string[] = [];

  useEffect(() => {
    const subscriber = onSnapshot(userInfoRef, docSnapshot => {
      if (docSnapshot.exists()) {
        if (docSnapshot.data().fullName != null) {
          setIsModalVisible(false);
        } else {
          setIsModalVisible(true);
        }
        if (docSnapshot.data().recentSearchs) {
          docSnapshot.data().recentSearchs.map(async (search: string) => {
            if (!searches.includes(search)) {
              searches.push(search);
              const docRef = doc(db, 'HomeReviews', search);
              const homeSnapshot = await getDoc(docRef);
              let homePic = '';

              if (homeSnapshot.exists()) {
                if (homeSnapshot.data().homePictures) {
                  homePic = homeSnapshot.data().homePictures[0].uri;
                } else {
                  homePic =
                    'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg';
                }
                const obj: RecentSearchType = {
                  homeId: search,
                  ownerId: homeSnapshot.data().owner.userId,
                  homePicture: homePic,
                  homeAddress: homeSnapshot.data().address.fullAddress,
                };

                setRecentSearches(prev => [...prev, obj]);
              }
            }
          });
        }
      } else {
        setIsModalVisible(true);
      }
      setIsLoading(false);
    });
    return () => subscriber();
  }, []);

  const setBasicInfo = async () => {
    const userInfoRef = doc(db, 'UserReviews', userId);
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (userInfoSnapshot.exists()) {
      await updateDoc(userInfoRef, {
        fullName: fullName,
        username: username,
        phoneNumber: phoneNumber,
      });
    }
    setIsModalVisible(false);
  };

  async function handleOnPressAddress(data: string, postalCode: string) {
    let idToAddToHistory = '';
    let addOrNot = true;
    let allRentals: RentalType[] = [];
    let propertyMainInfo = '';
    let city = '';
    let state = '';
    let isHomeAddress = false;
    let isCity = false;
    let isState = false;
    let specificHomeQuery = null;
    const array = data.split(',');

    if (array.length >= 4) {
      isHomeAddress = true;
      propertyMainInfo = array[0].trimStart();
      city = array[1].trimStart();
      state = array[2].trimStart();
    } else if (array.length === 3) {
      isCity = true;
      city = array[0].trimStart();
      state = array[1].trimStart();
    } else if (array.length === 2) {
      isState = true;
      state = array[0].trimStart();
    }

    if (isHomeAddress) {
      specificHomeQuery = query(
        collection(db, 'HomeReviews'),
        and(
          where('address.street', '==', propertyMainInfo),
          where('address.city', '==', city),
          where('address.state', '==', state),
        ),
      );
    } else if (isCity) {
      specificHomeQuery = query(
        collection(db, 'HomeReviews'),
        and(
          where('address.city', '==', city),
          where('address.state', '==', state),
        ),
      );
    } else if (isState) {
      specificHomeQuery = query(
        collection(db, 'HomeReviews'),
        and(where('address.state', '==', state)),
      );
    }

    // Check to see if any properties exist
    if (specificHomeQuery) {
      const homeSnapshot: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(specificHomeQuery);
      if (homeSnapshot.size > 0) {
        homeSnapshot.forEach(doc => {
          const rental = {
            data: doc.data(),
            homeId: doc.id,
          };
          allRentals.push(rental);
        });
      }
    }

    // If not properties exist and if the searched address is a home address,
    // add it to the db
    if (allRentals.length === 0) {
      if (isHomeAddress) {
        const newHomeAdded = await addDoc(collection(db, 'HomeReviews'), {
          address: {
            street: propertyMainInfo,
            city: city,
            state: state,
            postalCode: postalCode,
            fullAddress: data,
          },
          landlordService: {
            oneStar: 0,
            twoStar: 0,
            threeStar: 0,
            fourStar: 0,
            fiveStar: 0,
            avgLandlordServiceRating: 0,
          },
          houseQuality: {
            oneStar: 0,
            twoStar: 0,
            threeStar: 0,
            fourStar: 0,
            fiveStar: 0,
            avgHouseQualityRating: 0,
          },
          wouldRecommend: {
            yes: 0,
            no: 0,
          },
          overallRating: {
            oneStar: 0,
            twoStar: 0,
            threeStar: 0,
            fourStar: 0,
            fiveStar: 0,
            avgOverallRating: 0,
          },
          totalReviews: 0,
          owner: {
            userId: '',
          },
          totalSquareFeet: '',
          totalBathrooms: '',
          totalBedrooms: '',
          propertyDescription: '',
          statusOfRental: 'Unknown',
          rentalArea: '',
          monthlyRent: '',
          furnished: false,
          washerDryer: false,
          parking: false,
          internet: false,
          pool: false,
          airConditioning: false,
          dishwasher: false,
          privateBathroom: false,
          yard: false,
          homePictures: null,
        });
        idToAddToHistory = newHomeAdded.id;

        if (specificHomeQuery) {
          const homeSnapshot: QuerySnapshot<DocumentData, DocumentData> =
            await getDocs(specificHomeQuery);
          if (homeSnapshot.size > 0) {
            homeSnapshot.forEach(doc => {
              const rental = {
                data: doc.data(),
                homeId: doc.id,
              };
              allRentals.push(rental);
            });
          }
          navigation.removeListener;
          navigation.navigate('SearchRentals', {
            rentals: allRentals,
          });
        }
      } else {
        setResultsFound(false);
      }
    } else {
      navigation.removeListener;
      navigation.navigate('SearchRentals', {
        rentals: allRentals,
      });
    }

    if (isHomeAddress && idToAddToHistory !== '') {
      const userReviewRef = doc(db, 'UserReviews', userId);
      const userReviewSnapshot = await getDoc(userReviewRef);
      if (userReviewSnapshot.exists()) {
        const recentSearchs: string[] = userReviewSnapshot.data().recentSearchs;
        if (recentSearchs) {
          recentSearchs.map((search: string) => {
            if (search === idToAddToHistory) {
              addOrNot = false;
            }
          });
        }
        if (addOrNot) {
          if (recentSearchs) {
            await updateDoc(userReviewRef, {
              recentSearchs: [...recentSearchs, idToAddToHistory],
            });
          } else {
            await updateDoc(userReviewRef, {
              recentSearchs: [idToAddToHistory],
            });
          }
        }
      }
    }
  }

  const handleClickOnRecent = (search: RecentSearchType) => {
    navigation.removeListener;
    navigation.navigate('RentalDescription', {
      homeId: search.homeId,
      ownerId: search.ownerId,
    });
  };

  const closeModal = () => {
    setResultsFound(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={1}
          listViewDisplayed={false}
          fetchDetails={true}
          onPress={(data, details) => {
            let postalCode = '';
            if (data !== null && details !== null) {
              for (let i = 0; i < details.address_components.length; i++) {
                if (details.address_components[i].types[0] === 'postal_code') {
                  postalCode = details.address_components[i].long_name;
                }
                details.address_components[i];
              }
              handleOnPressAddress(data.description, postalCode);
            }
          }}
          query={{
            key: 'AIzaSyDMCC2Peu8bQvTkgddfI3OhHe3zTxNoSeU',
            language: 'en',
            components: 'country:us',
            types: ['street_number'],
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={300}
          styles={{
            textInput: {
              color: 'black',
              marginLeft: 2,
              marginRight: 2,
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
            },
            container: {
              width: '100%',
              position: 'absolute',
              top: insets.top,
              zIndex: 10,
            },
          }}
        />
        <View style={{marginTop: '15%'}}>
          <Text style={styles.recentSearches}>Recently Viewed Homes</Text>
          {isLoading ? (
            <ActivityIndicator
              style={{marginTop: '0%'}}
              size="large"
              color="#1f3839"
            />
          ) : !isLoading && recentSearches.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}
              horizontal>
              {recentSearches.map(search => (
                <RentalCard
                  key={search.homeId}
                  search={search}
                  handleRecentClick={handleClickOnRecent}
                />
              ))}
            </ScrollView>
          ) : !isLoading && recentSearches.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Card
                containerStyle={{
                  borderRadius: 20,
                  width: 370,
                  backgroundColor: '#1f3839',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  No History...Begin your journey with RentView!
                </Text>
              </Card>
            </View>
          ) : null}
        </View>
        <View style={{marginTop: '5%'}}>
          <Text style={styles.recentSearches}>Trending Nearby Properties</Text>
          {isLoading ? (
            <ActivityIndicator
              style={{marginTop: '20%'}}
              size="large"
              color="#1f3839"
            />
          ) : recentSearches.length > 0 ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}
              horizontal>
              {recentSearches.map(search => (
                <RentalCard
                  key={search.homeId}
                  search={search}
                  handleRecentClick={handleClickOnRecent}
                />
              ))}
            </ScrollView>
          ) : !isLoading && recentSearches.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Card
                containerStyle={{
                  borderRadius: 20,
                  width: 370,
                  backgroundColor: '#1f3839',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  No History...Begin your journey with RentView!
                </Text>
              </Card>
            </View>
          ) : null}
        </View>
        <View>
          <Modal isVisible={isModalVisible} animationIn={'bounceIn'}>
            <Modal.Container>
              <Modal.Header title="Welcome to RentView" />
              <Modal.Body>
                <Text
                  style={{
                    marginLeft: '5%',
                    marginTop: '5%',
                    color: '#969696',
                  }}>
                  Full Name
                </Text>
                <TextInput
                  style={styles.input}
                  maxLength={15}
                  onChangeText={onChangeFullName}
                  placeholder="John Doe"
                />
                <Text
                  style={{
                    marginLeft: '5%',
                    marginTop: '5%',
                    color: '#969696',
                  }}>
                  Username
                </Text>
                <TextInput
                  style={styles.input}
                  maxLength={15}
                  onChangeText={onChangeUserName}
                  placeholder="johndoe"
                />
                <Text
                  style={{
                    marginLeft: '5%',
                    marginTop: '5%',
                    color: '#969696',
                  }}>
                  Phone Number
                </Text>
                <TextInput
                  style={styles.input}
                  maxLength={10}
                  onChangeText={onChangePhoneNumber}
                  placeholder="(123)456-7890"
                  keyboardType="numeric"
                />
              </Modal.Body>
              <Modal.Footer>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={setBasicInfo}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    Start Exploring
                  </Text>
                </TouchableOpacity>
              </Modal.Footer>
            </Modal.Container>
          </Modal>
        </View>
        <View>
          <Modal
            isVisible={!resultsFound}
            animationIn={'bounce'}
            onBackdropPress={closeModal}>
            <Modal.Container>
              <Modal.Header title="No Properties Found" />
              <Modal.Body>
                <Text
                  style={{
                    marginLeft: '5%',
                    marginTop: '5%',
                    color: 'black',
                    fontSize: 20,
                    textAlign: 'center',
                  }}>
                  We are working on providing a larger variety of properties!
                </Text>
              </Modal.Body>
              <Modal.Footer>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={closeModal}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    Okay
                  </Text>
                </TouchableOpacity>
              </Modal.Footer>
            </Modal.Container>
          </Modal>
        </View>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width: '88%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
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
  rating: {
    fontSize: 20,
    fontWeight: '600',
  },
  recentSearches: {
    color: '#1f3839',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: '5%',
    marginLeft: 10,
  },
});

export default SearchMainScreen;
