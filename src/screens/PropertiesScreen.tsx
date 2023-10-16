import {View, Text, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccountStackParamList} from '../utils/types';
import {DocumentData, collection, onSnapshot, query} from 'firebase/firestore';
import {auth, db} from '../config/firebase';

type PropertiesProps = NativeStackScreenProps<
  AccountStackParamList,
  'PropertiesScreen'
>;

const PropertiesScreen: React.FC<PropertiesProps> = ({navigation}) => {
  const user = auth.currentUser;
  const [allProperties, setAllProperties] = useState<DocumentData[]>([]);
  const userPropertiesRef = query(
    collection(db, 'UserReviews', user?.uid ? user.uid : '', 'Properties'),
  );

  useEffect(() => {
    const subscriber = onSnapshot(userPropertiesRef, docSnapshot => {
      if (docSnapshot.size >= 1) {
        setAllProperties([]);
        docSnapshot.forEach(doc => {
          setAllProperties(prevArr => [...prevArr, doc.data()]);
        });
      }
    });
    return () => subscriber();
  }, []);

  const handleNewProperty = () => {
    navigation.navigate('RentalPostScreen');
  };

  return (
    <View>
      <Button title={'Add property'} onPress={handleNewProperty} />
      {allProperties.map(property => (
        <Text key={property.homeId}>{property.homeId};</Text>
      ))}
    </View>
  );
};

export default PropertiesScreen;
