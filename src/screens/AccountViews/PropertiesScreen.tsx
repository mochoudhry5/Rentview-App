import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccountStackParamList} from '../../utils/types';
import {auth, db} from '../../config/firebase';
import {ScrollView} from 'react-native-gesture-handler';
import AdvancedRentalCard from '../../components/AdvancedRentalCard';

type PropertiesProps = NativeStackScreenProps<
  AccountStackParamList,
  'PropertiesScreen'
>;

const PropertiesScreen: React.FC<PropertiesProps> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = auth.currentUser;
  const [allProperties, setAllProperties] = useState<DocumentData[]>([]);
  const userPropertiesRef = query(
    collection(db, 'UserReviews', user?.uid ? user.uid : '', 'MyProperties'),
  );

  useEffect(() => {
    const subscribe = onSnapshot(userPropertiesRef, docSnapshot => {
      if (docSnapshot.size >= 1) {
        setAllProperties([]);
        docSnapshot.forEach(doc => {
          setAllProperties(prevArr => [...prevArr, doc.data()]);
        });
      }
      setIsLoading(false);
    });

    return () => subscribe();
  }, []);

  const handleViewProperty = async (homeId: string) => {
    const homeInfoRef = doc(db, 'HomeReviews', homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);
    let ownerId = '';
    if (homeInfoSnapshot.exists()) {
      ownerId = homeInfoSnapshot.data().owner.userId;
    }
    navigation.removeListener;
    navigation.navigate('RentalDescription', {
      homeId: homeId,
      ownerId: ownerId,
    });
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <ActivityIndicator
          style={{
            height: '85%',
            alignContent: 'center',
            justifyContent: 'center',
          }}
          size="large"
          color="#1f3839"
        />
      ) : (
        <View style={{flex: 1}}>
          {allProperties.length > 0 ? (
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <ScrollView
                horizontal={false}
                style={{marginBottom: 30}}
                contentContainerStyle={{flexGrow: 1}}>
                {allProperties.map(property => (
                  <AdvancedRentalCard
                    key={property.homeId}
                    rental={property}
                    handleView={handleViewProperty}
                  />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.noReviewsView}>
              <Text style={{fontSize: 25, opacity: 0.5}}>No Properties</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noReviewsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PropertiesScreen;
