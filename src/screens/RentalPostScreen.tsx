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
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import ImageCarousel from '../components/ImageCarousel';
import {Country, State, City} from 'country-state-city';
import {Dropdown} from 'react-native-element-dropdown';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../utils/types';
import {auth, db} from '../config/firebase';
import {User} from 'firebase/auth';

type PostPropertyScreen = NativeStackScreenProps<
  HomeStackParamList,
  'RentalPostScreen'
>;

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

const rentalStatus = [
  {label: 'Available', value: 'Available'},
  {label: 'Occupied', value: 'Occupied'},
  {label: 'Not Renting', value: 'Not Renting'},
];

const rentalAreaSelections = [
  {label: 'Private Room', value: 'Private Room'},
  {label: 'Entire House', value: 'Entire House'},
];

const yesOrNo = [
  {label: 'Yes', value: 'Yes'},
  {label: 'No', value: 'No'},
];

const RentalPostScreen: React.FC<PostPropertyScreen> = ({
  route,
  navigation,
}) => {
  const refParam = route.params.homeDetails;
  const [user, setUser] = useState<User>();
  const [totalBedrooms, setTotalBedrooms] = useState<string>(
    refParam.totalBedrooms,
  );
  const [totalBathrooms, setTotalBathrooms] = useState<string>(
    refParam.totalBathrooms,
  );
  const [totalSquareFeet, setTotalSquareFeet] = useState<string>(
    refParam.totalSquareFeet,
  );
  const [statusOfRental, setStatusOfRental] = useState<string>(
    refParam.statusOfRental,
  );
  const [rentalArea, setRentalArea] = useState<string>(refParam.rentalArea);
  const [propertyDescription, setPropertyDescription] = useState<string>(
    refParam.propertyDescription,
  );
  const [monthlyRent, setMonthlyRent] = useState<string>(refParam.monthlyRent);
  const [furnished, setFurnished] = useState<string>(refParam.furnished);
  const [applianceIncluded, setApplianceIncluded] = useState<string>(
    refParam.applianceIncluded,
  );

  const userId = user ? user.uid : '';

  const handlePostSubmit = async () => {
    const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);

    if (homeInfoSnapshot.exists()) {
      await updateDoc(homeInfoRef, {
        totalSquareFeet: totalSquareFeet,
        totalBedrooms: totalBedrooms,
        totalBathrooms: totalBathrooms,
        statusOfRental: statusOfRental,
        propertyDescription: propertyDescription,
        rentalArea: rentalArea,
        monthlyRent: monthlyRent,
        furnished: furnished,
        applianceIncluded: applianceIncluded,
      });
    }
    navigation.navigate('RentalDescription', {
      homeId: route.params.homeId,
      ownerId: userId,
    });
  };

  const handleCancel = async () => {
    navigation.navigate('RentalDescription', {
      homeId: route.params.homeId,
      ownerId: userId,
    });
  };

  return (
    <View style={{flex: 1, paddingTop: '2%', backgroundColor: 'white'}}>
      <ScrollView>
        <ImageCarousel />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '2%',
              marginLeft: '4%',
            }}>
            Renting Out
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={rentalAreaSelections}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={rentalArea}
            onChange={item => {
              setRentalArea(item.label);
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '2%',
              marginLeft: '4%',
            }}>
            Monthly Rent
          </Text>
          <TextInput
            style={[styles.dropdown, {fontSize: 18}]}
            onChangeText={setMonthlyRent}
            value={monthlyRent}
            maxLength={20}
            placeholder="1500"
            keyboardType="numeric"
          />
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: '2%',
                marginLeft: '4%',
              }}>
              Status of Rental
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={rentalStatus}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={statusOfRental}
              onChange={item => {
                setStatusOfRental(item.label);
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: '2%',
                marginLeft: '4%',
              }}>
              Square Feet
            </Text>
            <TextInput
              style={[styles.dropdown, {fontSize: 18}]}
              onChangeText={setTotalSquareFeet}
              value={totalSquareFeet}
              maxLength={20}
              placeholder="2500"
              keyboardType="numeric"
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: '3%',
                marginLeft: '4%',
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
              value={totalBedrooms}
              onChange={item => {
                setTotalBedrooms(item.label);
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: '5%',
                marginLeft: '4%',
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
              value={totalBathrooms}
              onChange={item => {
                setTotalBathrooms(item.label);
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: '5%',
                marginLeft: '4%',
              }}>
              Furnished
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={yesOrNo}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={furnished}
              onChange={item => {
                setFurnished(item.label);
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: '5%',
                marginLeft: '4%',
              }}>
              Washer/Dryer Included
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={yesOrNo}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={applianceIncluded}
              onChange={item => {
                setApplianceIncluded(item.label);
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: '5%',
              marginLeft: '4%',
            }}>
            Property Description
          </Text>
          <TextInput
            style={styles.propertyDescription}
            multiline={true}
            onChangeText={setPropertyDescription}
            value={propertyDescription}
            placeholder="What makes your home unique?"
          />
        </View>
        <View style={{marginBottom: '20%'}} />
      </ScrollView>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={{fontWeight: 'bold', color: '#424242'}}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handlePostSubmit}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>Save</Text>
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
  propertyDescription: {
    height: 180,
    margin: 15,
    borderWidth: 0.8,
    borderRadius: 10,
    textAlignVertical: 'top',
    padding: '2%',
    fontSize: 16,
    marginTop: '5%',
    marginBottom: '20%',
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
