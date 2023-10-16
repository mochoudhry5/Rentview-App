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
  const [houseQuality, setHouseQuality] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<boolean>(false);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [landlordRating, setLandlordRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [thumbsUp, setThumbsUp] = useState<string>('thumbs-up-outline');
  const [thumbsDown, setThumbsDown] = useState<string>('thumbs-down-outline');
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

  return (
    <View>
      <ScrollView>
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
        <View style={{top: -100}}>
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
      </ScrollView>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
          Publish Review
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditReviewScreen;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    input: {
      height: 150,
      margin: 20,
      borderWidth: 1,
      borderRadius: 10,
      textAlignVertical: 'top',
      padding: '2%',
      fontSize: 16,
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
      height: '35%',
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    noButton: {
      height: '35%',
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
