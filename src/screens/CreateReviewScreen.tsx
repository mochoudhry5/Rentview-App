import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider';
import { collection, doc, query, updateDoc, getDoc, DocumentReference, DocumentData, addDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"
import { auth } from "../utils/firebase"

type CreateReviewProps = NativeStackScreenProps<RootStackParamList, "CreateReview">;

const CreateReviewScreen: React.FC<CreateReviewProps> = ( {route, navigation}) => {
  const [houseQuality, setHouseQuality] = useState(5); 
  const [userRecommend, setUserRecommend] = useState(false); 
  const {fontScale} = useWindowDimensions();
  const [userOverallRating, setUserOverallRating] = useState(5); 
  const [userLandlordRating, setUserLandlordRating] = useState(5); 
  const [text, onChangeText] = React.useState('');
  const styles = makeStyles(fontScale); 
  const user = auth.currentUser;


  const handleReviewSubmit = async () => {
    const docRef = doc(db, "HomeReviews", route.params.docId);
    let homeSnapshot = await getDoc(docRef);
    const taskDocRef = doc(db, 'HomeReviews', route.params.docId)

    if(homeSnapshot.exists()){
      const date = new Date();
      var month = date.getMonth() + 1; 
      var day = date.getDate(); 
      var year = date.getFullYear(); 

      var totalReviews = homeSnapshot.data().totalReviews + 1;

      var rating = {
        oneStar:   homeSnapshot.data().overallRating.oneStar, 
        twoStar:   homeSnapshot.data().overallRating.twoStar, 
        threeStar: homeSnapshot.data().overallRating.threeStar, 
        fourStar:  homeSnapshot.data().overallRating.fourStar, 
        fiveStar:  homeSnapshot.data().overallRating.fiveStar,
        avgOverallRating: 0
      }

      var landlordRating = {
        oneStar:   homeSnapshot.data().landlordService.oneStar, 
        twoStar:   homeSnapshot.data().landlordService.twoStar, 
        threeStar: homeSnapshot.data().landlordService.threeStar, 
        fourStar:  homeSnapshot.data().landlordService.fourStar, 
        fiveStar:  homeSnapshot.data().landlordService.fiveStar,
        avgLandlordService: 0
      }

      var recommendation = {
        yes: homeSnapshot.data().wouldRecommend.yes, 
        no: homeSnapshot.data().wouldRecommend.no, 
      }

      if(userRecommend){
        recommendation.yes += 1; 
      }
      else{
        recommendation.no += 1; 
      }

      if(userOverallRating === 1){
        rating.oneStar += + 1; 
      }
      else if (userOverallRating === 2){
        rating.twoStar += 1; 
      }
      else if(userOverallRating === 3){
        rating.threeStar += 1; 
      }
      else if(userOverallRating === 4){
        rating.fourStar += 1; 
      }
      else {
        rating.fiveStar += 1; 
      }

      if(userLandlordRating === 1){
        landlordRating.oneStar += + 1; 
      }
      else if (userLandlordRating === 2){
        landlordRating.twoStar += 1; 
      }
      else if(userLandlordRating === 3){
        landlordRating.threeStar += 1; 
      }
      else if(userLandlordRating === 4){
        landlordRating.fourStar += 1; 
      }
      else {
        landlordRating.fiveStar += 1; 
      }

      rating.avgOverallRating = ((1 * rating.oneStar)   + 
                                (2 * rating.twoStar)   +
                                (3 * rating.threeStar) + 
                                (4 * rating.fourStar)  +
                                (5 * rating.fiveStar)) / totalReviews;

      landlordRating.avgLandlordService = ((1 * landlordRating.oneStar)   + 
                                           (2 * landlordRating.twoStar)   +
                                           (3 * landlordRating.threeStar) + 
                                           (4 * landlordRating.fourStar)  +
                                           (5 * landlordRating.fiveStar)) / totalReviews;
      
      await updateDoc(taskDocRef, {
        landlordService: landlordRating, 
        wouldRecommend: recommendation,
        totalReviews: totalReviews, 
        overallRating: rating
      })

      if(user){ 

        await addDoc(collection(db, 'HomeReviews', route.params.docId, "IndividualRatings"), {
          landlordServiceRating: userLandlordRating,
          recommendHouseRating: userRecommend,
          overallRating: userOverallRating,
          additionalComment: text,
          dateOfReview: month + "/" + day + "/" + year, 
          reviewerEmail: user.email,
        })

        await addDoc(collection(db, 'UserReviews', user.email ? user.email : "No User", "Reviews"), {
          homeId: route.params.docId,
          landlordServiceRating: userLandlordRating,
          overallRating: userOverallRating,
          recommendHouseRating: userRecommend,
          additionalComment: text,
          dateOfReview: month + "/" + day + "/" + year, 
        })
      }
    }
  }

  const handleYesClick = () => {
    setUserRecommend(true); 
  }

  const handleNoClick = () => {
    setUserRecommend(false); 
  }

  return (
    <ScrollView style={{flex:1, backgroundColor:'white'}}>
    <View style={styles.container}> 
      <View style={[styles.card, styles.shadowProp]}>
        <View>
          <View style={{backgroundColor: '#FAFAFA', borderRadius: 10}}>
            <Text style={styles.heading}>Overall Rating:</Text>
            <Text style={styles.text}>{userOverallRating}/5</Text>
            <Slider
                step={1}
                style={styles.slider}
                value={userOverallRating}
                onValueChange={setUserOverallRating}
                maximumValue={5}
                minimumValue={1}
                thumbTintColor='#205030'
                minimumTrackTintColor='gray'
            />
          </View>
        </View>
      </View>
      <View style={[styles.card, styles.shadowProp]}>
        <View>
          <View style={{backgroundColor: '#FAFAFA', borderRadius: 10}}>
            <Text style={styles.heading}>Landlord Rating:</Text>
            <Text style={styles.text}>{userLandlordRating}/5</Text>
            <Slider
                step={1}
                style={styles.slider}
                value={userLandlordRating}
                onValueChange={setUserLandlordRating}
                maximumValue={5}
                minimumValue={1}
                thumbTintColor='#205030'
                minimumTrackTintColor='gray'
            />
          </View>
        </View>
      </View>
      <View style={[styles.card, styles.shadowProp]}>
        <View>
          <View style={{backgroundColor: '#FAFAFA', borderRadius: 10}}>
            <Text style={styles.heading}>House Rating:</Text>
            <Text style={styles.text}>{houseQuality}/5</Text>
            <Slider
                step={1}
                style={styles.slider}
                value={houseQuality}
                onValueChange={setHouseQuality}
                maximumValue={5}
                minimumValue={1}
                thumbTintColor='#205030'
                minimumTrackTintColor='gray'
            />
          </View>
        </View>
      </View>
      <View style={[styles.card, styles.shadowProp]}>
        <View>
          <View style={{backgroundColor: '#FAFAFA', borderRadius: 10}}>
            <Text style={styles.heading}>Rent Again:</Text>
            <View style ={{flexDirection:"row", justifyContent: 'center', paddingBottom:'5%'}}>
              <View style={{paddingRight:'5%', width:'35%'}}>
                <TouchableOpacity style={styles.yesButton} onPress={handleYesClick}>
                  <Text style={{color:'white', fontWeight:'bold', fontSize: 18 / fontScale}}>Yes</Text>
                </TouchableOpacity>
              </View>
              <View style={{width:'30%'}}>
              <TouchableOpacity style={styles.noButton} onPress={handleNoClick}>
                <Text style={{color:'white', fontWeight:'bold', fontSize: 18 / fontScale}}>No</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="Additional comments..."
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
              <Text style={{fontWeight:'bold', color:'#205030'}}>Publish Review</Text>
          </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
)
}

const makeStyles = (fontScale:any) => StyleSheet.create({
  card: {
    width: '80%',
    height:'15%',
    marginVertical: '5%',
    alignSelf:'center',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: .5,
    shadowRadius: 5,
  },
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center',
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
      height: '20%',
      width:'90%',
      borderWidth: 1,
    },
    submitButton: {
      alignItems: 'center',
      backgroundColor: '#dddddd',
      borderWidth: 1,
      width: '40%',
      height: '25%',
      alignSelf: 'center',
      justifyContent: 'center',
  },
    yesButton: {
      backgroundColor: '#205030',
      height:'55%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    noButton: {
      backgroundColor: '#6f112b',
      height:'55%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      fontSize: 18 / fontScale,
      fontWeight: '600',
      marginBottom: 13,
      paddingLeft: '2%',
      paddingTop: '2%',
    },
});


export default CreateReviewScreen


