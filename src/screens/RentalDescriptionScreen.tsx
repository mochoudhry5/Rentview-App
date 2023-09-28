import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import ImageSlider from './ImageSliderScreen';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"
import { doc, getDoc, query, onSnapshot, collection, DocumentData} from "firebase/firestore";
import { db } from '../utils/firebase';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Rating, AirbnbRating } from 'react-native-elements';
import { auth } from "../utils/firebase"

const images = [
  "https://source.unsplash.com/1024x768/?house",
  "https://source.unsplash.com/1024x768/?interior",
  "https://source.unsplash.com/1024x768/?backyard",
  "https://source.unsplash.com/1024x768/?garage"
];

type RentalDescriptionProps = NativeStackScreenProps<RootStackParamList, "RentalDescription">;

const RentalDescription: React.FC<RentalDescriptionProps> = ( { route, navigation } ) => {  
    const [totalReviews, setTotalReviews] = useState(0); 
    const [yesRecommendation, setYesRecommendation] = useState(0); 
    const [overallRating, setOverallRating] = useState(0); 
    const [landlordRating, setLandlordRating] = useState(0); 
    const [street, setStreet] = useState("");
    const [city, setCity] = useState(""); 
    const [state, setState] = useState(""); 
    const [postalCode, setPostalCode] = useState(""); 
    const [allReviews, setAllReviews] = useState<DocumentData[]>([]); 
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = ["3%","10%", "90%"];
    const docRef = doc(db, "HomeReviews", route.params.docId);
    const docRefSecond = query(collection(db, "HomeReviews", route.params.docId, "IndividualRatings"));
    const user = auth.currentUser;

    useEffect(() => {
      const subscriber = onSnapshot(docRef, (docSnapshot) => {
        if(docSnapshot.exists()){
          setTotalReviews(docSnapshot.data().totalReviews);
          setOverallRating(docSnapshot.data().overallRating.avgOverallRating);
          setYesRecommendation(docSnapshot.data().wouldRecommend.yes)
          setLandlordRating(docSnapshot.data().landlordService.avgLandlordService); 
        }
        getData(); 
      });

      const getData = () => {
        onSnapshot(docRefSecond, (docSnapshot) => {
          if(docSnapshot.size > 1){
            setAllReviews([]);
            docSnapshot.forEach((doc) => {
              setAllReviews((prevArr) => ([...prevArr, doc.data()]));
            });
          }
      
      })};

      return () => subscriber();

    }, [route.params.docId]);

    useEffect(() => {

      const fetchData = async () => {
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data()
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

      fetchData(); 

    }, []);

    const handleOnPress = () => {
      navigation.navigate("CreateReview", {docId: route.params.docId});
    }
  
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <ScrollView>
        <ImageSlider images={images} />
          <View>
            <View style={styles.addressLines}>
              <Text style={styles.addressLine1}>{street}</Text>
              <Text style={styles.addressLine2}>{city},{state} {postalCode}</Text>
            </View>
          </View>
          <View style={styles.inlineContainer}>
            <View style={styles.rating1}>
              <Text style={{textAlign: 'center', fontSize: 17, backgroundColor:'#dddddd',color:'#205030', fontStyle:'italic', borderWidth:.2, fontWeight:'bold'}}>Rent Again</Text>
              {totalReviews > 0 ? (
                <>
                  <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 19}}>{((yesRecommendation/totalReviews) * 100).toFixed(0)}%</Text>
                  <Text style={{textAlign: 'center', fontSize: 12}}>of people would rent this property out again</Text>
                </>
              ) : (<Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 19, paddingBottom:27}}>N/A</Text>)}
            </View>
            <View style={styles.rating1}>
              <Text style={{textAlign: 'center', fontSize: 17, backgroundColor:'#dddddd', color:'#205030', fontStyle:'italic', borderWidth:.2, fontWeight:'bold'}}>Landlord Rating</Text>
              {totalReviews > 0 && landlordRating > 0 ? (
                <>
                  <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 19}}>{landlordRating.toFixed(1)}/5.0</Text>
                  <Text style={{textAlign: 'center', fontSize: 12}}>rating has been given to the landlord.</Text>
                </>
              ) : (<Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 19, paddingBottom:27}}>N/A</Text>)}
            </View>
          </View>
      </ScrollView>
      <BottomSheet style={styles.bottomSheetShadow} ref={sheetRef} snapPoints={snapPoints} index={1}>
        <BottomSheetScrollView>
          <View style={styles.inlineContainer}>
            {totalReviews > 0 && overallRating > 0 ? (
              <>
                <Text style={styles.rating}>{overallRating.toFixed(1)}</Text>
                <Icon name='star' color= 'black' size={28}/>
              </>
            ) : (
              <Text style={[styles.rating, {fontSize: 20}]}>No Ratings Yet</Text>
            )}
            <View style={styles.inlineContainer}>
              <View style={styles.totalRentersContainer}>
                {totalReviews > 0 ? (
                  <>
                  <Text style = {styles.renters}>{"("}{totalReviews} Reviews{")"}</Text>
                  <TouchableOpacity style={styles.button} onPress={handleOnPress}>
                    <Text style={{ color: 'blue'}}>Add Review</Text>
                  </TouchableOpacity>
                </>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={handleOnPress}>
                    <Text style={{position: 'absolute', right: '2%', top:-10, color: 'blue'}}>Add Review</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          {allReviews.map(review => (
          <View style={{paddingTop:'5%', paddingLeft:'2%', paddingRight:'2%'}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                marginTop:'1%'}}
                source={{ uri: "https://source.unsplash.com/1024x768/?user" }}
              />
              <Text style={{paddingLeft:'1%', fontWeight:'bold', fontSize:14}}>{review.reviewerEmail}</Text>
            </View>
            <View style={{flexDirection:'row', paddingLeft:'0%', alignItems:'center'}}>
              <AirbnbRating 
                showRating={false} 
                selectedColor="black" 
                defaultRating={review.overallRating}
                size={10}
              />
              <Text style={{color:'gray', fontSize: 11, paddingLeft:'2%'}}>{review.dateOfReview}</Text>
            </View>
            <Text>{review.additionalComment}</Text>
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: .5,
                paddingTop:'5%'
              }}
            />
          </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );       
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'white',
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
    fontSize: 30,
    paddingLeft: '5%',
    fontWeight: '600',
  },
  totalRentersContainer: {
    flex: 1,
  },
  reviewDescription: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    fontSize: 14
  },
  renters: {
    fontSize: 20,
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
    fontSize: 22,
    
  },
  addressLine2: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
  },
  rating1: {
    backgroundColor: '#FAFAFA',
    width: '40%',
    marginLeft: '6%',
    borderWidth: .2,
    borderRadius: 20
  },
  button: {
    position: 'absolute',
    top: 5,
    left: 200, 
    color: 'blue', 
  },

});

export default RentalDescription;