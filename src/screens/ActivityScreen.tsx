import { View, Text } from 'react-native'
import React from 'react'
import { RootStackParamList } from "../utils/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type MyReviewProps = NativeStackScreenProps<RootStackParamList, "ActivityScreen">;

const MyReviews : React.FC<MyReviewProps> = ({route, navigation}) => {
  return (
    <View>
        {route.params.reviews.map(review => (
        <View key={review.homeId}>
            <Text>Landlord Service Rating: {review.landlordServiceRating}</Text>
            <Text>Recommendation Rating: {review.recommendHouseRating ? "Yes" : "No"}</Text>
            <Text>Comment: {review.additionalComment}</Text>
            <Text>Date of review: {review.dateOfReview}</Text>
            <Text>-----------------------------------------------------------</Text>
       </View> )
        )}
    </View>
  )
}

export default MyReviews