import React from 'react';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  images: string[];
  onPress: (index: number) => void;
  shift?: number;
  width: number;
  height: number;
};

const ImageList = ({images, shift = 0, onPress, width, height}: Props) => (
  <ScrollView
    horizontal
    style={styles.root}
    contentOffset={{x: shift * width, y: 0}}
    contentContainerStyle={styles.container}>
    {images.map((imageUrl, index) => (
      <TouchableOpacity
        style={styles.button}
        key={`${imageUrl}_${index}`}
        activeOpacity={0.8}
        onPress={() => onPress(index)}>
        <Image
          source={{uri: imageUrl}}
          style={{width: width, height: height, borderRadius: 5}}
        />
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  root: {flexGrow: 0, backgroundColor: 'white'},
  container: {
    flex: 0,
    paddingLeft: 2,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginRight: 2,
  },
});

export default ImageList;
