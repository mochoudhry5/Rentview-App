import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import ImageSlider from './ImageSliderScreen';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from '../utils/firebase';

const images = [
  "https://source.unsplash.com/1024x768/?home",
  "https://source.unsplash.com/1024x768/?homes",
  "https://source.unsplash.com/1024x768/?house",
  "https://source.unsplash.com/1024x768/?houses"
];

type RentalDescriptionProps = NativeStackScreenProps<RootStackParamList, "RentalDescription">;

const RentalDescription: React.FC<RentalDescriptionProps> = ( { route, navigation } ) => {  
    const [avgRating, setAvgRating] = useState(0); 
    const [totalReviews, setTotalReviews] = useState(0); 
    const [address, setAddress] = useState(""); 
    
    useEffect(() => {
      const docRef = doc(db, "HomeReviews", route.params.docId);
      if(route.params.docId !== '') {
        const unsubscribe = async () => {
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data()
              setAvgRating(data.avgRating);
              setTotalReviews(data.totalReviews); 
              setAddress(data.address.fullAddress);
            }
          } catch(error) {
            console.log(error)
          }
        }
        unsubscribe();
      }
      }, [route.params.docId]);

    const handleOnPress = () => {
      navigation.navigate("CreateReview");
    }
  
  return (
      <View>
        <View>
          <ImageSlider images={images} />
        </View>

        <View style={styles.container}>

          <View style={styles.square}>
            <Text style={styles.header}>Address</Text>
            <Text style={styles.addressInfo}>{address}</Text>
          </View>

          <View style={styles.square2}>
            <Text style={styles.header}>Rating</Text>
            <Text style={styles.avgRatingInfo}>{avgRating} / 5</Text>
          </View>

          <Text style = {{ marginLeft: 74}} />

          <View style={styles.square2}>
            <Text style={styles.header}>Reviews</Text>
            <Text style={styles.avgRatingInfo}>{totalReviews}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOnPress}>
            <Text>Write a review</Text>
          </TouchableOpacity>
        </View>

      </View>
  );       
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#7CA1B4",
    flex: 1,
    flexDirection:'row',
    flexWrap: "wrap",
    alignItems: 'center'
  },
  square: {
    backgroundColor: "lightblue",
    width: '100%',
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
    alignItems: 'center'
  },
  square2: {
    backgroundColor: "lightgreen",
    width: '40%',
    height: 75,
    borderRadius: 80,
    alignItems: 'center',
  },
  header: {
    fontFamily: "ChalkboardSE-Bold",
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  addressInfo : {
    fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 20,
    alignSelf: 'center',
  },
  avgRatingInfo : {
    fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 25,
    alignSelf: 'center',
  },
  button: {
    width: '40%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});

export default RentalDescription;
