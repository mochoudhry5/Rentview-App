import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider';

const CreateReviewScreen = () => {
    const [neighborhoodClean, setNeighborhoodClean] = useState(5); 
    const [crime, setCrime] = useState(5);
    const [landlordServ, setLandlordServ] = useState(5); 
    const [houseQuality, setHouseQuality] = useState(5); 
  return (
    <View style={styles.container}>
    <View style={{marginTop: '40%'}}>
        <Text style={styles.text}>Neighborhood Cleanliness: {neighborhoodClean}/10</Text>
        <Slider
            step={1}
            style={styles.slider}
            value={neighborhoodClean}
            onValueChange={setNeighborhoodClean}
            maximumValue={10}
            minimumValue={1}
        />

        <Text style={styles.text}>Crime Occurence: {crime}/10</Text>
        <Slider
            step={1}
            style={styles.slider}
            value={crime}
            onValueChange={setCrime}
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

        <Text style={styles.text}>House Quality: {houseQuality}/10</Text>
        <Slider
            step={1}
            style={styles.slider}
            value={houseQuality}
            onValueChange={setHouseQuality}
            maximumValue={10}
            minimumValue={1}
        />
    </View>

        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
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


