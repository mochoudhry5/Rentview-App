import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import ImageSlider from './ImageSliderScreen';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"
import { doc, getDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons'; 

const images = [
  "https://source.unsplash.com/1024x768/?house",
  "https://source.unsplash.com/1024x768/?interior",
  "https://source.unsplash.com/1024x768/?backyard",
  "https://source.unsplash.com/1024x768/?garage"
];

type RentalDescriptionProps = NativeStackScreenProps<RootStackParamList, "RentalDescription">;

const RentalDescription: React.FC<RentalDescriptionProps> = ( { route, navigation } ) => {  
    const [avgRating, setAvgRating] = useState(0); 
    const [totalReviews, setTotalReviews] = useState(0); 
    const [street, setStreet] = useState("");
    const [city, setCity] = useState(""); 
    const [state, setState] = useState(""); 
    const [postalCode, setPostalCode] = useState(""); 
    const {fontScale} = useWindowDimensions();
    const styles = makeStyles(fontScale); 
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = ["15%", "90%"];
    
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
              setStreet(data.address.street);
              setCity(data.address.city); 
              setState(data.address.state); 
              setPostalCode(data.address.postalCode); 
            }
          } catch(error) {
            console.log(error)
          }
        }
        unsubscribe();
      }
      }, [route.params.docId]);

    const handleOnPress = () => {
      navigation.navigate("CreateReview", {docId: route.params.docId});
    }
  
  return (
<GestureHandlerRootView style={styles.rootView}>
      <ImageSlider images={images} />
        <View>
          <View style={styles.addressLines}>
            <Text style={styles.addressLine1}>{street}</Text>
            <Text style={styles.addressLine2}>{city},{state} {postalCode}</Text>
          </View>
        </View>
      <ScrollView style={{flex:1}}>
        <View style={styles.inlineContainer}>
          <View style={styles.rating1}>
            <Text style={{textAlign: 'center', fontSize: 17 / fontScale, backgroundColor:'#8f9da6',color:'#205030', fontStyle:'italic', borderWidth:.2, fontWeight:'bold'}}>Rent Again</Text>
            <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 19 / fontScale}}>86%</Text>
            <Text style={{textAlign: 'center', fontSize: 12 / fontScale}}>of people would rent this property out again</Text>
          </View>
          <View style={styles.rating1}>
            <Text style={{textAlign: 'center', fontSize: 17 / fontScale,backgroundColor:'#8f9da6', color:'#205030', fontStyle:'italic', borderWidth:.2, fontWeight:'bold'}}>Landlord Rating</Text>
            <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 19 / fontScale}}>3.4/5.0</Text>
            <Text style={{textAlign: 'center', fontSize: 12 / fontScale}}>rating has been given to the landlord.</Text>
          </View>
        </View>
      </ScrollView>
      <BottomSheet style={styles.bottomSheetShadow} ref={sheetRef} snapPoints={snapPoints}>
          <BottomSheetScrollView>
            <View style={styles.inlineContainer}>
              <Text style={styles.rating}>4.6</Text>
              <Icon name='star' color= 'black' size={28}/>
              <View style={styles.inlineContainer}>
                <View style={styles.totalRentersContainer}>
                  <Text style = {styles.renters}>{"("}{totalReviews} Reviews{")"}</Text>
                  <TouchableOpacity style={styles.button} onPress={handleOnPress}>
                    <Text style={{color: 'blue'}}>Add Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {totalReviews > 0 ? (
              <Text style={styles.reviewDescription}>Read reviews from previous tenants.</Text>
            ) : (
              <View style={styles.reviewsSection}>
                <Text style={styles.reviewsSection}>No Reviews Found</Text>
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
    </GestureHandlerRootView>
  );       
};

const makeStyles = (fontScale:any) => StyleSheet.create({
  rootView: {
    flex: 1
  },
  bottomSheetShadow: {
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  inlineContainer: {
    flexDirection:'row',
    alignItems: 'center',
    borderRadius: 20
  },
  rating: {
    fontSize: 30 / fontScale,
    paddingLeft: '5%',
    fontWeight: '600',
  },
  star: {
    width: 25 / fontScale,
    height: 25 / fontScale,
  },
  totalRentersContainer: {
    flex: 1,
  },
  reviewDescription: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    fontSize: 14 / fontScale
  },
  renters: {
    fontSize: 20 / fontScale,
    marginLeft: '2%'
  },
  reviewsSection: {
    marginTop: '2.5%',
    textAlign: 'center',
  },
  houseImage: {
    width: '100%',
    height: '35%',
    top: 0, 
    alignItems: 'center',
    justifyContent:'center',
  },
  addressLines: {
    backgroundColor: '#FAFAFA',
    width: '100%',
    marginBottom: '1%'
  },
  addressLine1: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22 / fontScale,
    
  },
  addressLine2: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14 / fontScale,
  },
  rating1: {
    backgroundColor: '#FAFAFA',
    width: '40%',
    marginLeft: '6%',
    borderWidth: .2,
    borderRadius: 20
  },
  button: {
    // alignItems: 'center',
    // backgroundColor: 'lightblue',
    // padding: 10,
    // borderRadius: 4,
    // borderWidth: 2,
    // width: '40%',
    // alignSelf: 'center'
    position: 'absolute',
    top: 5,
    left: 200, 
    color: 'blue', 
  },

});

export default RentalDescription;
