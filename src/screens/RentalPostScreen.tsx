import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, {useState} from 'react';
import ImageCarousel from './ImageCarousel';
import {Country, State, City} from 'country-state-city';
import {Dropdown} from 'react-native-element-dropdown';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccountStackParamList} from '../utils/types';
import {auth, db} from '../config/firebase';

type PostPropertyScreen = NativeStackScreenProps<
  AccountStackParamList,
  'RentalPostScreen'
>;

type RegionDataType = {
  label: string;
  value: string;
};

const bedAndBath = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
  {label: '5', value: '5'},
  {label: '6', value: '6'},
  {label: '7', value: '7'},
  {label: '8', value: '8'},
  {label: '9', value: '9'},
  {label: '10+', value: '10+'},
];

const RentalPostScreen: React.FC<PostPropertyScreen> = ({navigation}) => {
  const user = auth.currentUser;
  const [chosenAddress, setChosenAddress] = useState<string>('');
  const [chosenCountry, setChosenCountry] = useState<string>('');
  const [chosenState, setChosenState] = useState<string>('');
  const [chosenCity, setChosenCity] = useState<string>('');
  const [totalBedrooms, setTotalBedrooms] = useState<string>('');
  const [totalBathrooms, setTotalBathrooms] = useState<string>('');
  const [chosenPostalCode, setChosenPostalCode] = useState<string>('');
  const [countries, setCountries] = useState<Array<RegionDataType>>([
    {label: 'United States', value: 'US'},
  ]);
  const [cities, setCities] = useState<Array<RegionDataType>>([
    {label: '', value: ''},
  ]);
  const [states, setStates] = useState<Array<RegionDataType>>([
    {label: '', value: ''},
  ]);

  const handlePostSubmit = async () => {
    let homeInfo = query(
      collection(db, 'HomeReviews'),
      where('address.street', '==', chosenAddress),
    );

    let homeSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(
      homeInfo,
    );

    if (homeSnapshot.size !== 1) {
      let fullAddress =
        chosenAddress +
        ', ' +
        chosenCity +
        ', ' +
        chosenState +
        ', ' +
        chosenCountry +
        ' ' +
        chosenPostalCode;

      const newHomePost = await addDoc(collection(db, 'HomeReviews'), {
        address: {
          street: chosenAddress,
          city: chosenCity,
          state: chosenState,
          postalCode: chosenPostalCode,
          fullAddress: fullAddress,
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

      await addDoc(
        collection(db, 'UserReviews', user?.uid ? user.uid : '', 'Properties'),
        {
          address: {
            street: chosenAddress,
            city: chosenCity,
            state: chosenState,
            postalCode: chosenPostalCode,
            fullAddress: fullAddress,
          },
          homeId: newHomePost.id,
        },
      );
    }
  };

  const handleCancel = () => {
    navigation.navigate('PropertiesScreen');
  };

  return (
    <View style={{flex: 1, paddingTop: '2%', backgroundColor: 'white'}}>
      <ScrollView>
        <ImageCarousel />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: '2%',
            marginLeft: '5%',
          }}>
          Street Address
        </Text>
        <TextInput
          style={[styles.dropdown, {fontSize: 18}]}
          onChangeText={setChosenAddress}
          value={chosenAddress}
          maxLength={20}
          placeholder="Enter Home address"
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: '2%',
            marginLeft: '5%',
          }}>
          Postal Code
        </Text>
        <TextInput
          style={[styles.dropdown, {fontSize: 18}]}
          onChangeText={setChosenPostalCode}
          value={chosenPostalCode}
          maxLength={20}
          placeholder="Enter Postal Code"
          keyboardType="numeric"
        />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '2%',
              marginLeft: '5%',
            }}>
            Country
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={countries}
            maxHeight={300}
            labelField="label"
            valueField="value"
            onChange={item => {
              setChosenCountry(item.label);
              const allStates = State.getStatesOfCountry(item.value);
              let statesData: Array<RegionDataType> = [];
              allStates.map(states => {
                statesData.push({label: states.name, value: states.isoCode});
              });
              setStates(statesData);
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '2%',
              marginLeft: '5%',
            }}>
            State
          </Text>
          <Dropdown
            search
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={states}
            maxHeight={300}
            labelField="label"
            valueField="value"
            onChange={item => {
              setChosenState(item.label);
              const allCities = City.getCitiesOfState('US', item.value);
              let citiesData: Array<RegionDataType> = [];
              allCities.map(city => {
                citiesData.push({label: city.name, value: city.stateCode});
              });
              setCities(citiesData);
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '2%',
              marginLeft: '5%',
            }}>
            City
          </Text>
          <Dropdown
            search
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={cities}
            maxHeight={300}
            labelField="label"
            valueField="value"
            onChange={item => {
              setChosenCity(item.label);
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '3%',
              marginLeft: '5%',
            }}>
            Bedrooms
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={bedAndBath}
            maxHeight={300}
            labelField="label"
            valueField="value"
            onChange={item => {
              setTotalBedrooms(item.label);
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '5%',
              marginLeft: '5%',
            }}>
            Bathrooms
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={bedAndBath}
            maxHeight={300}
            labelField="label"
            valueField="value"
            onChange={item => {
              setTotalBathrooms(item.label);
            }}
          />
        </View>
        <View style={{marginBottom: '20%'}} />
      </ScrollView>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={{fontWeight: 'bold', color: '#424242'}}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handlePostSubmit}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: '30%',
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width: '30%',
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  dropdown: {
    margin: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default RentalPostScreen;
