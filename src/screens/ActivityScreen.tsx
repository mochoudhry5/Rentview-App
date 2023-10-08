import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { AccountStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AirbnbRating } from 'react-native-elements';

type MyReviewProps = NativeStackScreenProps<AccountStackParamList, "ActivityScreen">;

const MyReviews : React.FC<MyReviewProps> = ({route, navigation}) => {
  return (
    <ScrollView>
      {route.params.reviews.map(review => (
      <View key={review.homeId}>
        <View style={{ paddingTop: '5%', paddingLeft: '2%', paddingRight: '2%' }}>
          <View style={{ flexDirection: 'row', paddingLeft: '0%', alignItems: 'center' }}>
            <AirbnbRating
              showRating={false}
              selectedColor="black"
              defaultRating={review.overallRating}
              size={10} />
            <Text style={{ color: 'gray', fontSize: 11, paddingLeft: '2%' }}>{review.dateOfReview}</Text>
          </View>
          <Text style={{paddingLeft:'1%', paddingRight:'1%'}}>{review.additionalComment}</Text>
          <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
            <Text>Landlord Rating: {review.landlordServiceRating}</Text>
            <Text>Rent Again: {review.recommendHouseRating ? "Yes" : "No"}</Text>
          </View>
          <Text>HomeId: {review.homeId}</Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: .5,
              paddingTop: '5%'
            }} />
        </View>
      </View> )
      )}
    </ScrollView>
  )
}

export default MyReviews