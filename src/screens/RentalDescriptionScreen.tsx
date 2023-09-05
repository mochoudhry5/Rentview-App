import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import ImageSlider from './ImageSliderScreen';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types"

const images = [
  "https://source.unsplash.com/1024x768/?home",
  "https://source.unsplash.com/1024x768/?homes",
  "https://source.unsplash.com/1024x768/?house",
  "https://source.unsplash.com/1024x768/?houses"
];


type RentalDescriptionProps = NativeStackScreenProps<RootStackParamList, "RentalDescription">;

const RentalDescription: React.FC<RentalDescriptionProps> = ( { route, navigation } ) => {
  
  const handleOnPress = () => {
    navigation.navigate("CreateReview");
  }


  return (
    <View style={styles.container}>
      <View style={styles.rect}></View>
      <View style={styles.rect3}>
        <ImageSlider images={images} />
        <View style={styles.loremIpsumRow}>
          <Text style={styles.loremIpsum}>
            {route.params.data}
          </Text>
          <View style={styles.currentOwnerColumn}>
            <Text style={styles.currentOwner}>Current Owner:</Text>
            <Text style={styles.johnDoeSmith}>John Doe Smith</Text>
          </View>
        </View>
        <View style={styles.ellipse1StackRow}>
          <View style={styles.ellipse1Stack}>
            <Svg viewBox="0 0 111.42 108.72" style={styles.ellipse1}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="rgba(230, 230, 230,1)"
                cx={56}
                cy={54}
                rx={56}
                ry={54}
              ></Ellipse>
            </Svg>
            <Text style={styles.loremIpsum4}>4.7</Text>
            <Text style={styles.rating}>Rating</Text>
          </View>
          <View style={styles.ellipse2Stack}>
            <Svg viewBox="0 0 111.42 108.72" style={styles.ellipse2}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="rgba(230, 230, 230,1)"
                cx={56}
                cy={54}
                rx={56}
                ry={54}
              ></Ellipse>
            </Svg>
            <Text style={styles.loremIpsum5}>100</Text>
            <Text style={styles.reviews}>Reviews</Text>
          </View>
        </View>
      </View>
      <View style={styles.writeAReviewStack}>
        <TouchableOpacity style={styles.button} onPress={handleOnPress}>
          <Text style={styles.writeAReview}>Write a review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rect: {
    flex: 0.5,
    backgroundColor: "rgba(239, 239, 239,1)"
  },
  rect3: {
    top: -8,
    left: -25,
    width: 425,
    height: 501,
    position: "absolute",
    backgroundColor: "rgba(200,216,241,1)"
  },
  loremIpsum: {
    fontFamily: "Courier-Bold",
    color: "#121212",
    fontSize: 15,
    width: 179,
    height: 40
  },
  currentOwner: {
    fontFamily: "roboto-italic",
    color: "#121212",
    fontSize: 14,
    width: 117,
    height: 21
  },
  johnDoeSmith: {
    fontFamily: "Courier-Oblique",
    color: "#121212",
    fontSize: 16,
    width: 135,
    height: 42,
    marginTop: 5
  },
  currentOwnerColumn: {
    width: 135,
    marginLeft: 35
  },
  loremIpsumRow: {
    height: 68,
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 29,
  },
  ellipse1: {
    top: 0,
    left: 0,
    width: 111,
    height: 109,
    position: "absolute"
  },
  loremIpsum4: {
    top: 30,
    left: 37,
    position: "absolute",
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 25
  },
  rating: {
    top: 64,
    left: 35,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 24,
    width: 41
  },
  ellipse1Stack: {
    width: 111,
    height: 109
  },
  ellipse2: {
    top: 0,
    left: 0,
    width: 111,
    height: 109,
    position: "absolute"
  },
  loremIpsum5: {
    top: 30,
    left: 35,
    position: "absolute",
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 25
  },
  reviews: {
    top: 64,
    left: 30,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 24,
    width: 52
  },
  ellipse2Stack: {
    width: 111,
    height: 109,
    marginLeft: 92
  },
  ellipse1StackRow: {
    height: 109,
    flexDirection: "row",
    marginLeft: 52,
    marginRight: 59
  },
  writeAReview: {
    top: 10,
    left: 21,
    position: "absolute",
    fontFamily: "comic-sans-ms-regular",
    color: "#121212",
    width: 111,
    height: 20
  },
  button: {
    top: 0,
    left: 0,
    width: 140,
    height: 40,
    position: "absolute",
    backgroundColor: "rgba(74,144,226,1)",
    opacity: 0.39,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 0.18,
    shadowRadius: 0,
    borderWidth: 0,
    borderColor: "#000000",
    borderStyle: "dashed",
    overflow: "visible",
    borderRadius: 17
  },
  writeAReviewStack: {
    top: 734,
    left: 117,
    width: 140,
    height: 40,
    position: "absolute"
  }
});

export default RentalDescription;
