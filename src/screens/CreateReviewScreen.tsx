import { View, Text, StyleSheet, TouchableOpacity, TextInput, useWindowDimensions, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider';
import { collection, doc, query, updateDoc, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from '../utils/firebase';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"
import Icon from 'react-native-vector-icons/Ionicons'; 
import { ScrollView } from 'react-native-gesture-handler';

type CreateReviewProps = NativeStackScreenProps<RootStackParamList, "CreateReview">;

const CreateReviewScreen: React.FC<CreateReviewProps> = ( {route, navigation}) => {

    const [overallRating, setOverallRating] = useState(5); 
    const [landlordRating, setLandlordRating] = useState(5); 
    const [text, onChangeText] = React.useState('');
    const {fontScale} = useWindowDimensions();
    const styles = makeStyles(fontScale); 


    const handleReviewSubmit = async () => {
      let homeInfo = query(collection(db, "HomeReviews", route.params.docId, "averageRating"));
      let homeSnapshot : QuerySnapshot<DocumentData, DocumentData> = await getDocs(homeInfo);
      const taskDocRef = doc(db, 'HomeReviews', route.params.docId)
      if(homeSnapshot.size < 1){
        await updateDoc(taskDocRef, {
          avgOverallRating: overallRating, 
          avgLandlordRating: landlordRating, 
        })
      }
    }

  return (
    <ScrollView style={{flex:1, backgroundColor:'white'}}>
      <View style={styles.container}> 
        <View style={[styles.card, styles.shadowProp]}>
          <View>
            <View style={{backgroundColor: '#FAFAFA'}}>
              <Text style={styles.heading}>Overall Rating:</Text>
              <Text style={styles.text}>{overallRating}/5</Text>
              <Slider
                  step={1}
                  style={styles.slider}
                  value={overallRating}
                  onValueChange={setOverallRating}
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
            <View style={{backgroundColor: '#FAFAFA'}}>
              <Text style={styles.heading}>Landlord Rating:</Text>
              <Text style={styles.text}>{landlordRating}/5</Text>
              <Slider
                  step={1}
                  style={styles.slider}
                  value={landlordRating}
                  onValueChange={setLandlordRating}
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
            <View style={{backgroundColor: '#FAFAFA'}}>
              <Text style={styles.heading}>Rent Again:</Text>
              <View style ={{flexDirection:"row", justifyContent: 'center', paddingBottom:'5%'}}>
                <View style={{paddingRight:'5%', width:'35%'}}>
                  <TouchableOpacity style={styles.yesButton}>
                    <Text style={{color:'white', fontWeight:'bold', fontSize: 18 / fontScale}}>Yes</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width:'30%'}}>
                <TouchableOpacity style={styles.noButton}>
                  <Text style={{color:'white', fontWeight:'bold', fontSize: 18 / fontScale}}>No</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.container}>
            <TouchableOpacity style={styles.submitButton}>
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
      marginVertical: '7%',
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
        paddingTop: '2%'

      },
});

export default CreateReviewScreen


