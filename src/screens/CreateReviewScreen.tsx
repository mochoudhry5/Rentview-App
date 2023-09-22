import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider';
import { collection, doc, query, updateDoc, getDoc, DocumentReference, DocumentData, addDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"

type CreateReviewProps = NativeStackScreenProps<RootStackParamList, "CreateReview">;

const CreateReviewScreen: React.FC<CreateReviewProps> = ( {route, navigation}) => {
    const [houseQuality, setHouseQuality] = useState(5); 
    const [landlordServ, setLandlordServ] = useState(5); 
    const [recommendation, setRecommendation] = useState(5); 


    const handleReviewSubmit = async () => {
      const docRef = doc(db, "HomeReviews", route.params.docId);
      let homeSnapshot = await getDoc(docRef);
      const taskDocRef = doc(db, 'HomeReviews', route.params.docId)

      if(homeSnapshot.exists()){
        await updateDoc(taskDocRef, {
          avgHomeQuality: houseQuality, 
          avgLandlordService: landlordServ, 
          avgRecommendation: recommendation,
          totalReviews: homeSnapshot.data().totalReviews + 1, 
        })

        await addDoc(collection(db, 'HomeReviews', route.params.docId, "IndividualRatings"), {
          houseQualityRating: houseQuality,
          landlordServiceRating: landlordServ,
          recommendHouseRating: recommendation
        })
      }
    }

  return (
    <View style={styles.container}>
    <View style={{marginTop: '40%'}}>
        <Text style={styles.text}>House Quality: {houseQuality}/10</Text>
        <Slider
            step={1}
            style={styles.slider}
            value={houseQuality}
            onValueChange={setHouseQuality}
            maximumValue={10}
            minimumValue={1}
        />

        <Text style={styles.text}>Landlord Service: {landlordServ}/10</Text>
        <Slider
            step={1}
            style={styles.slider}
            value={landlordServ}
            onValueChange={setLandlordServ}
            maximumValue={10}
            minimumValue={1}
        />
        <Text style={styles.text}>Recommend To Others: {recommendation}/10</Text>
        <Slider
            step={1}
            style={styles.slider}
            value={recommendation}
            onValueChange={setRecommendation}
            maximumValue={10}
            minimumValue={1}
        />
    </View>

        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleReviewSubmit}>
                <Text>Submit review</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    writeAReview: {
        fontFamily: "comic-sans-ms-regular",
        fontSize: 16,
        color: "black",
      },
    button: {
        alignItems: 'center',
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 4,
        borderWidth: 2,
        width: '40%',
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
      },
    slider: {
        width: '70%',
        opacity: 1,
        marginTop: 3,
        alignSelf: 'center',
        marginBottom: 25,
      },
      text: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        margin: 0,
      },
})

export default CreateReviewScreen


