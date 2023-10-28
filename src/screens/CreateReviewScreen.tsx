import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../utils/types';
import {auth} from '../config/firebase';
import {AirbnbRating} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {onAuthStateChanged, User} from 'firebase/auth';
import {handleReview} from '../utils/firebaseCalls';

type CreateReviewProps = NativeStackScreenProps<
  HomeStackParamList,
  'CreateReview'
>;

const CreateReviewScreen: React.FC<CreateReviewProps> = ({
  route,
  navigation,
}) => {
  const [userHouseQuality, setUserHouseQuality] = useState<number>(5);
  const [userRecommend, setUserRecommend] = useState<boolean>(false);
  const {fontScale} = useWindowDimensions();
  const [userOverallRating, setUserOverallRating] = useState<number>(5);
  const [userLandlordRating, setUserLandlordRating] = useState<number>(5);
  const [text, onChangeText] = useState<string>('');
  const [thumbsUp, setThumbsUp] = useState<string>('thumbs-up-outline');
  const [thumbsDown, setThumbsDown] = useState<string>('thumbs-down-outline');
  const styles = makeStyles(fontScale);
  const [user, setUser] = useState<User>();
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const toggleSwitch = () => setIsAnonymous(previousState => !previousState);
  const userId = user ? user.uid : '';
  const homeId = route.params.homeId;

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const handleReviewSubmit = async () => {
    handleReview(
      homeId,
      userOverallRating,
      userHouseQuality,
      userRecommend,
      userLandlordRating,
      text,
    );
    navigation.navigate('RentalDescription', {homeId: homeId});
  };

  const handleYesClick = () => {
    if (thumbsUp == 'thumbs-up-outline') {
      setThumbsDown('thumbs-down-outline');
      setThumbsUp('thumbs-up');
      setUserRecommend(true);
    } else {
      setThumbsUp('thumbs-up-outline');
      setUserRecommend(false);
    }
  };

  const handleNoClick = () => {
    if (thumbsDown == 'thumbs-down-outline') {
      setThumbsDown('thumbs-down');
      setThumbsUp('thumbs-up-outline');
      setUserRecommend(false);
    } else {
      setThumbsDown('thumbs-down-outline');
      setUserRecommend(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={{marginBottom: '20%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Iowan Old Style',
              }}>
              Post as Anonymous
            </Text>
            <Switch
              trackColor={{false: 'grey', true: 'green'}}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isAnonymous}
              style={{transform: [{scaleX: 1}, {scaleY: 0.9}]}}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '3%',
              }}>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
              <View>
                <Text
                  style={{
                    fontFamily: 'Iowan Old Style',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  Overall Rating
                </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            </View>
            <AirbnbRating
              showRating={true}
              selectedColor="black"
              defaultRating={userOverallRating}
              onFinishRating={setUserOverallRating}
              size={20}
              reviewColor="gray"
              reviewSize={13}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '5%',
              }}>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
              <View>
                <Text
                  style={{
                    fontFamily: 'Iowan Old Style',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  Landlord Rating
                </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            </View>
            <AirbnbRating
              showRating={true}
              selectedColor="black"
              defaultRating={userLandlordRating}
              onFinishRating={setUserLandlordRating}
              size={20}
              reviewColor="gray"
              reviewSize={13}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '5%',
              }}>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
              <View>
                <Text
                  style={{
                    fontFamily: 'Iowan Old Style',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  House Quality
                </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            </View>
            <AirbnbRating
              showRating={true}
              selectedColor="black"
              defaultRating={userHouseQuality}
              onFinishRating={setUserHouseQuality}
              size={20}
              reviewColor="gray"
              reviewSize={13}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: '5%',
            }}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text
                style={{
                  fontFamily: 'Iowan Old Style',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  paddingLeft: '2%',
                  paddingRight: '2%',
                }}>
                Rent Again
              </Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingTop: '3%',
            }}>
            <TouchableOpacity style={styles.yesButton} onPress={handleYesClick}>
              <Icon name={thumbsUp} size={30} style={{color: '#538c50'}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton} onPress={handleNoClick}>
              <Icon name={thumbsDown} size={30} style={{color: '#FF5147'}} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: '5%',
            }}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text
                style={{
                  fontFamily: 'Iowan Old Style',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  paddingLeft: '2%',
                  paddingRight: '2%',
                }}>
                Write a Comment
              </Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <TextInput
            style={styles.input}
            multiline={true}
            onChangeText={onChangeText}
            value={text}
            placeholder="How was your experience?"
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleReviewSubmit}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
          Publish Review
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    input: {
      height: 180,
      margin: 20,
      borderWidth: 0.8,
      borderRadius: 10,
      textAlignVertical: 'top',
      padding: '2%',
      fontSize: 16,
      marginTop: '5%',
      marginBottom: '20%',
    },
    submitButton: {
      alignItems: 'center',
      backgroundColor: '#1f3839',
      borderWidth: 1,
      width: '100%',
      height: '7%',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    yesButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '7%',
    },
    noButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '7%',
    },
  });

export default CreateReviewScreen;
