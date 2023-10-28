import React from 'react';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  images: string[];
  onPress: (index: number) => void;
  shift?: number;
};

const IMAGE_WIDTH = 220;
const IMAGE_HEIGHT = 220;

const ImageList = ({images, shift = 0, onPress}: Props) => (
  <ScrollView
    horizontal
    style={styles.root}
    contentOffset={{x: shift * IMAGE_WIDTH, y: 0}}
    contentContainerStyle={styles.container}>
    {images.map((imageUrl, index) => (
      <TouchableOpacity
        style={styles.button}
        key={`${imageUrl}_${index}`}
        activeOpacity={0.8}
        onPress={() => onPress(index)}>
        <Image source={{uri: imageUrl}} style={styles.image} />
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  root: {flexGrow: 0, backgroundColor: 'white'},
  container: {
    flex: 0,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginRight: 10,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
  },
});

export default ImageList;
