import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {DocumentData} from 'firebase/firestore';
import {Card} from '@rneui/base';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  rental: DocumentData;
  handleView: (homeId: string) => void;
};

const AdvancedRentalCard: React.FC<Props> = ({rental, handleView}) => {
  return (
    <Card>
      {rental.homePictures !== null ? (
        <Card.Image
          style={{borderRadius: 5, marginBottom: 10}}
          source={{uri: rental.homePictures[0].uri}}
        />
      ) : (
        <Card.Image
          style={{borderRadius: 5, marginBottom: 10}}
          source={{
            uri: 'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg',
          }}
        />
      )}
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
        }}>
        {rental.fullAddress}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <TouchableOpacity
          style={styles.viewProperty}
          onPress={() => {
            handleView(rental.homeId);
          }}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>
            Manage Property
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.unclaim}>
          <Text style={{fontWeight: 'bold', color: 'red'}}>Unclaim</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  rating: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewProperty: {
    backgroundColor: '#1f3839',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
  unclaim: {
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
});

export default AdvancedRentalCard;
