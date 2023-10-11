import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { AccountStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AirbnbRating } from 'react-native-elements';

type MyReviewProps = NativeStackScreenProps<AccountStackParamList, "ActivityScreen">;

const MyReviews : React.FC<MyReviewProps> = ({route, navigation}) => {
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <ScrollView>
        {route.params.reviews.map(review => (
        <View key={review.homeId}>
          <View style={{marginTop:'3%'}}>
            <Text style={{fontSize:15, fontWeight:'bold', textAlign:'center', alignSelf:'center'}}>11021 Faber Way, Rancho Cordova, 95670, CA</Text>
            <View style={{ paddingTop: '2%', paddingLeft: '2%', paddingRight: '2%' }}>
              <View style={{ flexDirection: 'row', paddingLeft: '0%', alignItems: 'center', justifyContent:'space-evenly' }}>
                <TouchableOpacity style={styles.cancelButton}>
                    <Text style={{fontWeight:'bold', color:'#424242'}}>Go to Property</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={{fontWeight:'bold', color:'white'}}>View/Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:'5%'}}>
                <Text style={{color: 'gray', fontSize: 12, paddingLeft: '2%' }}>{review.dateOfReview}</Text>
              </View>
              <View
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: .5,
                  paddingTop: '1%'
                }} />
            </View>
          </View>
        </View> )
        )}
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width:'30%',
    height:25,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:20
},
saveButton: {
    alignItems: 'center',
    backgroundColor: '#1f3839',
    borderWidth: 1,
    width:'30%',
    height:25,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:20
},

});
export default MyReviews