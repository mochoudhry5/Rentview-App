import React from 'react';
import {Image, ScrollView, TouchableOpacity} from 'react-native';

type Props = {
  images: string[];
  onPress: (index: number) => void;
  width: number;
  height: number;
  snapEnabled?: boolean;
};

const ImageList = ({
  images,
  onPress,
  width,
  height,
  snapEnabled = false,
}: Props) => {
  return (
    <ScrollView horizontal pagingEnabled={snapEnabled} scrollEventThrottle={16}>
      {images.map((imageUrl, index) => (
        <TouchableOpacity
          key={`${imageUrl}_${index}`}
          activeOpacity={0.8}
          onPress={() => onPress(index)}>
          <Image
            source={{uri: imageUrl}}
            style={{
              margin: 2,
              marginBottom: 7,
              width: width,
              height: height,
              borderRadius: 7,
            }}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ImageList;
