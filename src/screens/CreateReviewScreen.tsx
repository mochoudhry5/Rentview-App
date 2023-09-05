import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { Rating, AirbnbRating } from 'react-native-ratings';

const CreateReviewScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
        <Rating
            showRating
            style={styles.rating}
            startingValue={0}
            fractions={1}
        />
        <TextInput
            style={styles.input}
            placeholder="Enter your review..."
            multiline
            numberOfLines={4}
        />
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
            <Text>Write a review</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    rating: {
        marginTop:100,
        marginBottom: 50
    },
    input: {
        marginTop: 50,
        height: 40,
        margin: 12,
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        minHeight:200
    },
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
        width: 150,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 80,
    },
})

export default CreateReviewScreen


