import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider';
import { collection, doc, query, updateDoc, getDoc, DocumentReference, DocumentData, addDoc, setDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"
import { auth } from "../utils/firebase"
import { AirbnbRating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type CreateReviewProps = NativeStackScreenProps<RootStackParamList, "CreateReview">;

const CreateReviewScreen: React.FC<CreateReviewProps> = ( {route, navigation}) => {
  const [houseQuality, setHouseQuality] = useState(5); 
  const [userRecommend, setUserRecommend] = useState(false); 
  const {fontScale} = useWindowDimensions();
  const [userOverallRating, setUserOverallRating] = useState(5); 
  const [userLandlordRating, setUserLandlordRating] = useState(5); 
  const [text, onChangeText] = useState('');
  const [thumbsUp,setThumbsUp] = useState ('thumbs-up-outline');
  const [thumbsDown,setThumbsDown] = useState ('thumbs-down-outline');
  const styles = makeStyles(fontScale); 
  const user = auth.currentUser;

  const handleReviewSubmit = async () => {
    const docRef = doc(db, "HomeReviews", route.params.docId);
    let homeSnapshot = await getDoc(docRef);
    const userRef = doc(db, "UserReviews", user ? user.uid : "NULL");
    const docSnap = await getDoc(userRef);

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
      
      await updateDoc(docRef, {
        landlordService: landlordRating, 
        wouldRecommend: recommendation,
        totalReviews: totalReviews, 
        overallRating: rating
      })

      if(user && docSnap.exists()){ 

        // await addDoc(collection(db, 'HomeReviews', route.params.docId, "IndividualRatings", user.uid ? user.uid : "NULL"), {
        //   landlordServiceRating: userLandlordRating,
        //   recommendHouseRating: userRecommend,
        //   overallRating: userOverallRating,
        //   additionalComment: text,
        //   dateOfReview: month + "/" + day + "/" + year, 
        //   reviewer: {
        //     email: user.email,
        //     fullName: ""
        //   }
        // })

        await setDoc(doc(db, 'HomeReviews', route.params.docId, "IndividualRatings", user.uid ? user.uid : "NULL"), {
          landlordServiceRating: userLandlordRating,
          recommendHouseRating: userRecommend,
          overallRating: userOverallRating,
          additionalComment: text,
          dateOfReview: month + "/" + day + "/" + year, 
          reviewerEmail: user.email,
          reviewerFullName: docSnap.data().fullName
        })

        await addDoc(collection(db, 'UserReviews', user.uid ? user.uid : "NULL", "Reviews"), {
          homeId: route.params.docId,
          landlordServiceRating: userLandlordRating,
          overallRating: userOverallRating,
          recommendHouseRating: userRecommend,
          additionalComment: text,
          dateOfReview: month + "/" + day + "/" + year, 
        })
      }
    }
    navigation.navigate("RentalDescription", {docId: route.params.docId});
  }

  const handleYesClick = () => {
    if(thumbsUp == 'thumbs-up-outline'){
      setThumbsDown('thumbs-down-outline');
      setThumbsUp('thumbs-up');
      setUserRecommend(true); 
    }
    else{
      setThumbsUp('thumbs-up-outline');
      setUserRecommend(false);
    }
  }

  const handleNoClick = () => {
    if(thumbsDown == 'thumbs-down-outline'){
      setThumbsDown('thumbs-down');
      setThumbsUp('thumbs-up-outline');
      setUserRecommend(false);
    }
    else{
      setThumbsDown('thumbs-down-outline');
      setUserRecommend(false);
    }
  }
  
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <ScrollView>
      <View> 
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:'5%'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text style={{fontFamily: 'Iowan Old Style', fontWeight:'bold', fontSize:20,textAlign: 'center', paddingLeft:'2%', paddingRight:'2%'}}>Overall Rating</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <AirbnbRating 
            showRating={true} 
            selectedColor="black" 
            defaultRating={userOverallRating}
            onFinishRating={setUserOverallRating}
            size={20}
            reviewColor='gray'
            reviewSize={13}
          />
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:'5%'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text style={{fontFamily: 'Iowan Old Style', fontWeight:'bold', fontSize:20,textAlign: 'center', paddingLeft:'2%', paddingRight:'2%'}}>Landlord Rating</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <AirbnbRating 
            showRating={true} 
            selectedColor="black" 
            defaultRating={userLandlordRating}
            onFinishRating={setUserLandlordRating}
            size={20}
            reviewColor='gray'
            reviewSize={13}
          />
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:'5%'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text style={{fontFamily: 'Iowan Old Style', fontWeight:'bold', fontSize:20,textAlign: 'center', paddingLeft:'2%', paddingRight:'2%'}}>House Quality</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <AirbnbRating 
            showRating={true} 
            selectedColor="black" 
            defaultRating={houseQuality}
            onFinishRating={setHouseQuality}
            size={20}
            reviewColor='gray'
            reviewSize={13}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:'5%'}}>
          <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          <View>
            <Text style={{fontFamily: 'Iowan Old Style', fontWeight:'bold', fontSize:20,textAlign: 'center', paddingLeft:'2%', paddingRight:'2%'}}>Rent Again</Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
        </View>
        <View style ={{flexDirection:"row", justifyContent:'center', paddingTop:'3%'}}>
          <TouchableOpacity style={styles.yesButton} onPress={handleYesClick}>
            <Icon name={thumbsUp} size={30} style={{color:'#538c50'}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButton} onPress={handleNoClick}>
            <Icon name={thumbsDown} size={30} style={{color:'#FF5147'}}/>
          </TouchableOpacity>
        </View>
        <View style={{top:-100}}>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:'5%'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text style={{fontFamily: 'Iowan Old Style', fontWeight:'bold', fontSize:20,textAlign: 'center', paddingLeft:'2%', paddingRight:'2%'}}>Write a Comment</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <TextInput
            style={styles.input}
            multiline={true}
            onChangeText={onChangeText}
            value={text}
            placeholder="The house/landlord were..."
          />
        </View>
      </View>
    </ScrollView>
    <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
      <Text style={{fontSize:16,fontWeight:'bold', color:'white'}}>Publish Review</Text>
    </TouchableOpacity>
  </View>
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
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: .1,
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
      height:150,
      margin:20,
      borderWidth: 1,
      borderRadius:10,
      textAlignVertical:'top',
      padding:5,
      marginBottom:80
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
      height:'35%',
      width:'30%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    noButton: {
      height:'35%',
      width:'30%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      fontSize: 18 / fontScale,
      fontWeight: '600',
      marginBottom: 13,
      paddingLeft: '5%',
      paddingTop: '2%',
      textAlign:'center'
    },
});


export default CreateReviewScreen


