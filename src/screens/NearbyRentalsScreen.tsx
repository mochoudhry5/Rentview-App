import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView, Dimensions, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { calculateDistance } from '../utils/calculateDistance';
import { sampleData } from '../utils/sampleData';
import { RootStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, addDoc, query, where, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from '../utils/firebase';
import { auth } from "../utils/firebase"
import { signOut } from "firebase/auth";

type SearchRentalsProps = NativeStackScreenProps<RootStackParamList, "SearchRentals">;

const defaultRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.01, // Adjust the initial zoom level here to see streets
  longitudeDelta: 0.01, // Adjust the initial zoom level here to see streets
};

const NearbyRentalView: React.FC<SearchRentalsProps> = ({ navigation }) => {
  const [initialRegion, setInitialRegion] = useState(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRentalIndex, setSelectedRentalIndex] = useState<number | null>(null);
  const [displayedMarkers, setDisplayedMarkers] = useState<boolean[]>([]);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
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
            initialRegion.longitude + rental.longitude
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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully:');
      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  const nextRentalHome = () => {
    // Navigate to the next closest rental home
    if (selectedRentalIndex !== null && selectedRentalIndex < sampleData.length - 1) {
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

  async function handleOnPressAddress(data : string, postalCode : string) {
    let docId = ""; 
    let array = data.split(',')
    let streetAddress = array[0]; 
    let city = array[1]; 
    let state = array[2]; 
    let homeInfo = query(collection(db, "HomeReviews"), where("address.street", "==", streetAddress));
    let homeSnapshot : QuerySnapshot<DocumentData, DocumentData> = await getDocs(homeInfo);

    if(homeSnapshot.size !== 1)
    {
      await addDoc(collection(db, 'HomeReviews'), {
        address: {
          street: streetAddress, 
          city: city, 
          state: state, 
          postalCode: postalCode,
          fullAddress: data
        },
        avgRating: 0,
        totalReviews: 0
      })
    }

    homeSnapshot = await getDocs(homeInfo);

    homeSnapshot.forEach(doc => {
      docId = doc.id; 
    });

    navigation.navigate("RentalDescription", { docId: docId });
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
        >
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2}
            listViewDisplayed={false} 
            fetchDetails={true}
            onPress={(data, details) => {
              let postalCode = ""; 
              if(data !== null && details !== null)
              {
                for (let i = 0; i < details.address_components.length; i++) {
                
                  if (details.address_components[i].types[0] === "postal_code") {
                      postalCode = details.address_components[i].long_name
                  }
                  details.address_components[i]

                }
                handleOnPressAddress(data.description, postalCode)
              }
            }}
            query={{
                key: 'AIzaSyDMCC2Peu8bQvTkgddfI3OhHe3zTxNoSeU',
                language: 'en'
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={300}
            styles={{
              textInput: {
                height: 40,
                color: "black",
                fontSize: 14,
                marginTop: 43,
                marginLeft: 2, 
                marginRight: 2, 
                backgroundColor: 'white',
                width: "90%",
                borderWidth: 2,
                borderColor: "black",
                borderRadius: 10
              },
            }}
          />
          {/* {sampleData.map((rental, index) =>
              displayedMarkers[index] ? (
              <Marker
                  key={rental.id}
                  pinColor={'green'}
                  coordinate={{
                  latitude: initialRegion.latitude + rental.latitude,
                  longitude: initialRegion.longitude + rental.longitude,
                  }}
              >
              </Marker>
              ) : null
          )} */}
        </MapView>
          {/* {selectedRentalIndex !== null && (
            <RentalDescriptionScreen
              name={sampleData[selectedRentalIndex].name}
              rooms={sampleData[selectedRentalIndex].rooms}
              address={sampleData[selectedRentalIndex].address}
            />
          )} */}
          {/* <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={prevRentalHome} style={styles.navigationButtons}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextRentalHome} style={styles.navigationButtons}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View> */}
        </>
      )}
      {/* <Button onPress={handleLogout} title="log out" /> */}
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
      top: 0
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
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default NearbyRentalView;