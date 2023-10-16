import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DocumentData} from 'firebase/firestore';
import {AirbnbRating} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

type EditReviewProps = {
  currentProperty: DocumentData | undefined;
};

const EditReviewScreen: React.FC<EditReviewProps> = ({currentProperty}) => {
  const [houseQuality, setHouseQuality] = useState(0);
  const [recommendation, setRecommendation] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [landlordRating, setLandlordRating] = useState(0);
  const [comment, setComment] = useState('');
  const [thumbsUp, setThumbsUp] = useState('thumbs-up-outline');
  const [thumbsDown, setThumbsDown] = useState('thumbs-down-outline');
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  useEffect(() => {
    if (currentProperty) {
      setHouseQuality(currentProperty.review.houseRating);
      setRecommendation(currentProperty.review.recommendHouseRating);
      setOverallRating(currentProperty.review.overallRating);
      setLandlordRating(currentProperty.review.landlordServiceRating);
      setComment(currentProperty.review.additionalComment);
      currentProperty.review.recommendHouseRating
        ? handleYesClick()
        : handleNoClick();
    }
  }, []);

  const handleYesClick = () => {
    if (thumbsUp == 'thumbs-up-outline') {
      setThumbsDown('thumbs-down-outline');
      setThumbsUp('thumbs-up');
      setRecommendation(true);
    } else {
      setThumbsUp('thumbs-up-outline');
      setRecommendation(false);
    }
  };

  const handleNoClick = () => {
    if (thumbsDown == 'thumbs-down-outline') {
      setThumbsDown('thumbs-down');
      setThumbsUp('thumbs-up-outline');
      setRecommendation(false);
    } else {
      setThumbsDown('thumbs-down-outline');
      setRecommendation(false);
    }
  };

  const handleReviewChange = () => {};

  return (
    <View>
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
            defaultRating={overallRating}
            onFinishRating={setOverallRating}
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
              paddingTop: '7%',
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
            defaultRating={landlordRating}
            onFinishRating={setLandlordRating}
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
              paddingTop: '7%',
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
            defaultRating={houseQuality}
            onFinishRating={setHouseQuality}
            size={20}
            reviewColor="gray"
            reviewSize={13}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: '7%',
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
            paddingTop: '2%', 
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
          onChangeText={setComment}
          value={comment}
        />
    </View>
  );
};

export default EditReviewScreen;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    shadowProp: {
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    slider: {
      width: '70%',
      opacity: 1,
      alignSelf: 'center',
    },
    text: {
      fontSize: 16 / fontScale,
      textAlign: 'center',
      fontWeight: 'bold',
      margin: 0,
    },
    input: {
      height: 150,
      borderWidth: .8,
      borderRadius: 10,
      textAlignVertical: 'top',
      padding: '2%',
      fontSize: 16,
      marginLeft:'5%',
      marginRight:'5%',
      marginTop:'5%',
      marginBottom:'20%',
    },
    yesButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight:'7%'
    },
    noButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft:'7%'
    },
    heading: {
      fontSize: 18 / fontScale,
      fontWeight: '600',
      marginBottom: 13,
      paddingLeft: '5%',
      paddingTop: '2%',
      textAlign: 'center',
    },
  });
