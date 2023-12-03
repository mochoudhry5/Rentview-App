import {View, ScrollView} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParamList} from '../utils/types';
import RentalCard from '../components/RentalCard';
import {RentalType} from '../utils/types';

type SearchRentalsProps = NativeStackScreenProps<
  SearchStackParamList,
  'SearchRentals'
>;
const SearchRentals: React.FC<SearchRentalsProps> = ({route, navigation}) => {
  const handleHomeClick = (rental: RentalType) => {
    navigation.removeListener;
    navigation.navigate('RentalDescription', {
      homeId: rental.homeId,
      ownerId: rental.data.owner.userId,
    });
  };

  return (
    <View style={{marginBottom: 15}}>
      <ScrollView
        style={{marginTop: 10, height: '100%'}}
        contentContainerStyle={{flexGrow: 1}}>
        {route.params.rentals.map(rental => (
          <RentalCard
            key={rental.homeId}
            rental={rental}
            handleHomeClick={handleHomeClick}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchRentals;
