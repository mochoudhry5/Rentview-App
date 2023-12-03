import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Card} from '@rneui/base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RentalType, RecentSearchType} from '../utils/types';

type Props = {
  rental?: RentalType;
  search?: RecentSearchType;
  handleHomeClick?: (rental: RentalType) => void;
  handleRecentClick?: (search: RecentSearchType) => void;
};

const RentalCard: React.FC<Props> = ({
  rental,
  search,
  handleHomeClick,
  handleRecentClick,
}) => {
  return rental && handleHomeClick ? (
    <TouchableOpacity
      style={{marginBottom: 15}}
      onPress={() => handleHomeClick(rental)}>
      <Card
        containerStyle={{
          borderRadius: 20,
          backgroundColor: 'white',
        }}>
        {rental.data.homePictures !== null ? (
          <Card.Image
            style={{borderRadius: 5, marginBottom: 10}}
            source={{uri: rental.data.homePictures[0].uri}}
          />
        ) : (
          <Card.Image
            style={{borderRadius: 5, marginBottom: 10}}
            source={{
              uri: 'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg',
            }}
          />
        )}
        <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>
          {rental.data.address.fullAddress}
        </Text>
        <Text>Status of Rental: {rental.data.statusOfRental}</Text>
        <View style={{flexDirection: 'row'}}>
          {rental.data.overallRating.avgOverallRating !== 0 ? (
            <>
              <Text style={styles.rating}>
                {rental.data.overallRating.avgOverallRating.toFixed(1)}
              </Text>
              <Icon name="star" color="black" size={20} />
            </>
          ) : (
            <Text>No Ratings Yet</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  ) : search && handleRecentClick ? (
    <TouchableOpacity onPress={() => handleRecentClick(search)}>
      <Card
        containerStyle={{
          borderRadius: 20,
          width: 300,
          backgroundColor: 'white',
        }}>
        <Card.Image
          style={{borderRadius: 5}}
          source={{uri: search.homePicture}}
        />
        <Card.FeaturedTitle
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            textAlign: 'center',
            color: '#1f3839',
          }}>
          {search.homeAddress}
        </Card.FeaturedTitle>
      </Card>
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  rating: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default RentalCard;
