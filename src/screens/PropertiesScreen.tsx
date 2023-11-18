import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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
import {AccountStackParamList} from '../utils/types';
import {auth, db} from '../config/firebase';
import {ScrollView} from 'react-native-gesture-handler';

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
    const subscriber = onSnapshot(userPropertiesRef, docSnapshot => {
      if (docSnapshot.size >= 1) {
        setAllProperties([]);
        docSnapshot.forEach(doc => {
          setAllProperties(prevArr => [...prevArr, doc.data()]);
        });
      }
      setIsLoading(false);
    });
    return () => subscriber();
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
              <ScrollView style={{flex: 1}}>
                {allProperties.map(property => (
                  <View key={property.homeId}>
                    <View style={{marginTop: '3%'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}>
                        {property.fullAddress}
                      </Text>
                      <View
                        style={{
                          paddingTop: '2%',
                          paddingLeft: '2%',
                          paddingRight: '2%',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            paddingTop: '1%',
                          }}>
                          <TouchableOpacity
                            style={styles.viewProperty}
                            onPress={() => {
                              handleViewProperty(property.homeId);
                            }}>
                            <Text style={{fontWeight: 'bold', color: 'white'}}>
                              Manage Property
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.unclaim}>
                            <Text style={{fontWeight: 'bold', color: 'red'}}>
                              Unclaim
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginTop: '5%',
                          }}>
                          <Text
                            style={{
                              color: 'gray',
                              fontSize: 12,
                              paddingLeft: '2%',
                            }}>
                            Date Claimed: {property.dateAdded}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderBottomColor: 'gray',
                            borderBottomWidth: 0.5,
                            paddingTop: '1%',
                          }}
                        />
                      </View>
                    </View>
                  </View>
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
  viewProperty: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width: '35%',
    height: 25,
    aligxnSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  unclaim: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    width: '35%',
    height: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  inlineContainer: {
    alignItems: 'center',
    borderRadius: 20,
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
  noReviewsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width: '92%',
    height: '35%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: '10%',
  },
});

export default PropertiesScreen;
