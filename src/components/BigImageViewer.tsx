import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import ImageList from './ImageList';
import ImageViewing from 'react-native-image-viewing/dist/ImageViewing';
import ImageFooter from './ImageFooter';
import {ImageType} from '../utils/types';

const imageData = [
  {
    filename: '',
    uri: 'https://source.unsplash.com/1024x768/?house',
    data: '',
  },
  {
    filename: '',
    uri: 'https://source.unsplash.com/1024x768/?car',
    data: '',
  },
  {
    filename: '',
    uri: 'https://source.unsplash.com/1024x768/?backyard',
    data: '',
  },
];

const RentalDescripImageViewer = () => {
  const [currentImageIndex, setImageIndex] = useState(1);
  const [images, setImages] = useState<ImageType[]>(imageData);
  const [isVisible, setIsVisible] = useState(false);

  const onSelect = (images: ImageType[], index: number) => {
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
  };

  const onRequestClose = () => setIsVisible(false);

  return (
    <SafeAreaView style={styles.root}>
      <ImageList
        images={images.map(image => (image.uri ? image.uri : 'NULL'))}
        onPress={index => onSelect(images, index)}
        width={386}
        height={260}
      />
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        presentationStyle="overFullScreen"
        backgroundColor="white"
        visible={isVisible}
        onRequestClose={onRequestClose}
        FooterComponent={({imageIndex}) => (
          <ImageFooter imageIndex={imageIndex} imagesCount={images.length} />
        )}
      />
    </SafeAreaView>
  );
};

export default RentalDescripImageViewer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
});
