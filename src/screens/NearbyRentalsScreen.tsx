import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {calculateDistance} from '../utils/calculateDistance';
import {sampleData} from '../utils/sampleData';
import {HomeStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
  getDoc,
} from 'firebase/firestore';
import {auth, db} from '../config/firebase';
import {Modal} from '../components/Modal';

type SearchRentalsProps = NativeStackScreenProps<
  HomeStackParamList,
  'SearchRentals'
>;

const defaultRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.01, // Adjust the initial zoom level here to see streets
  longitudeDelta: 0.01, // Adjust the initial zoom level here to see streets
};

const NearbyRentalView: React.FC<SearchRentalsProps> = ({
  route,
  navigation,
}) => {
  const userId = auth.currentUser ? auth.currentUser.uid : '';
  const [initialRegion, setInitialRegion] = useState(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRentalIndex, setSelectedRentalIndex] = useState<number | null>(
    null,
  );
  const [displayedMarkers, setDisplayedMarkers] = useState<boolean[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [fullName, onChangeFullName] = useState('');
  const [username, onChangeUserName] = useState('');

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        let closestRentalIndex: number | null = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        // Initialize the displayedMarkers array with 'false' for all markers
        const initialDisplayedMarkers = sampleData.map(() => false);

        sampleData.forEach((rental, index) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            initialRegion.latitude + rental.latitude,
            initialRegion.longitude + rental.longitude,
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestRentalIndex = index;
          }
        });

        if (closestRentalIndex !== null) {
          setSelectedRentalIndex(closestRentalIndex);
          const updatedDisplayedMarkers = [...initialDisplayedMarkers];
          updatedDisplayedMarkers[closestRentalIndex] = true;
          setDisplayedMarkers(updatedDisplayedMarkers);
        }

        setIsLoading(false);
      },
      error => {
        console.error(error);
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    const subscribe = async () => {
      const docRef = doc(db, 'UserReviews', userId);
      let homeSnapshot = await getDoc(docRef);

      if (homeSnapshot.exists()) {
        if (homeSnapshot.data().fullName != null) {
          setIsModalVisible(false);
        } else {
          setIsModalVisible(true);
        }
      } else {
        setIsModalVisible(true);
      }
    };

    subscribe();
  }, []);

  const setBasicInfo = async () => {
    const userInfoRef = doc(db, 'UserReviews', userId);
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (userInfoSnapshot.exists()) {
      await updateDoc(userInfoRef, {
        fullName: fullName,
        username: username,
      });
    }
    setIsModalVisible(false);
  };

  const nextRentalHome = () => {
    // Navigate to the next closest rental home
    if (
      selectedRentalIndex !== null &&
      selectedRentalIndex < sampleData.length - 1
    ) {
      setSelectedRentalIndex(selectedRentalIndex + 1);

      // Hide the previously selected marker
      const updatedDisplayedMarkers = [...displayedMarkers];
      updatedDisplayedMarkers[selectedRentalIndex] = false;
      setDisplayedMarkers(updatedDisplayedMarkers);

      // Show the marker for the next rental home
      updatedDisplayedMarkers[selectedRentalIndex + 1] = true;
      setDisplayedMarkers(updatedDisplayedMarkers);
    }
  };

  const prevRentalHome = () => {
    // Navigate to the previous closest rental home
    if (selectedRentalIndex !== null && selectedRentalIndex > 0) {
      setSelectedRentalIndex(selectedRentalIndex - 1);

      // Hide the previously selected marker
      const updatedDisplayedMarkers = [...displayedMarkers];
      updatedDisplayedMarkers[selectedRentalIndex] = false;
      setDisplayedMarkers(updatedDisplayedMarkers);

      // Show the marker for the previous rental home
      updatedDisplayedMarkers[selectedRentalIndex - 1] = true;
      setDisplayedMarkers(updatedDisplayedMarkers);
    }
  };

  async function handleOnPressAddress(data: string, postalCode: string) {
    let docId = '';
    let array = data.split(',');
    let streetAddress = array[0];
    let city = array[1];
    let state = array[2];
    let homeInfo = query(
      collection(db, 'HomeReviews'),
      where('address.street', '==', streetAddress),
    );
    let homeSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(
      homeInfo,
    );

    if (homeSnapshot.size !== 1) {
      await addDoc(collection(db, 'HomeReviews'), {
        address: {
          street: streetAddress,
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
      });
    }

    homeSnapshot = await getDocs(homeInfo);

    homeSnapshot.forEach(doc => {
      docId = doc.id;
    });

    navigation.navigate('RentalDescription', {docId: docId});
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
          />

          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2}
            listViewDisplayed={false}
            fetchDetails={true}
            onPress={(data, details) => {
              let postalCode = '';
              if (data !== null && details !== null) {
                for (let i = 0; i < details.address_components.length; i++) {
                  if (
                    details.address_components[i].types[0] === 'postal_code'
                  ) {
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
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={300}
            styles={{
              textInput: {
                height: 40,
                color: 'black',
                fontSize: 14,
                marginTop: 43,
                marginLeft: 2,
                marginRight: 2,
                backgroundColor: 'white',
                width: '90%',
                borderWidth: 2,
                borderColor: 'black',
                borderRadius: 10,
              },
            }}
          />
          <Modal isVisible={isModalVisible}>
            <Modal.Container>
              <Modal.Header title="Welcome to RentView" />
              <Modal.Body>
                <Text
                  style={{marginLeft: '5%', marginTop: '5%', color: '#969696'}}>
                  Full Name
                </Text>
                <TextInput
                  style={styles.input}
                  maxLength={15}
                  onChangeText={onChangeFullName}
                  placeholder="John Doe"
                />
                <Text
                  style={{marginLeft: '5%', marginTop: '5%', color: '#969696'}}>
                  Username
                </Text>
                <TextInput
                  style={styles.input}
                  maxLength={15}
                  onChangeText={onChangeUserName}
                  placeholder="johndoe"
                />
              </Modal.Body>
              <Modal.Footer>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={setBasicInfo}>
                  <Text
                    style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                    Start Exploring
                  </Text>
                </TouchableOpacity>
              </Modal.Footer>
            </Modal.Container>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
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
});

export default NearbyRentalView;
