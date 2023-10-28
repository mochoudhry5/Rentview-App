import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';

const ImageCarousel = (props: any) => {
  const [images, setImages] = useState([{}]);

  const openCameraRoll = () => {
    let imageList = [{}];
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 400,
      cropping: true,
      multiple: true,
      maxFiles: 10,
      includeBase64: true,
    })
      .then(response => {
        response.map(image => {
          imageList.push({
            filename: image.filename,
            path: image.path,
            data: image.data,
          });
        });
      })
      .catch(error => {
        // Error happens if the user opens and closes without selecting any photos
        // Right now it is throwing a promise rejection when that occurs
        console.log(error);
      });

    setImages(imageList);
    console.log(images);
  };

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <TouchableOpacity onPress={openCameraRoll}>
          <Image
            source={{
              uri: 'https://media.istockphoto.com/id/1248723171/vector/camera-photo-upload-icon-on-isolated-white-background-eps-10-vector.jpg?s=612x612&w=0&k=20&c=e-OBJ2jbB-W_vfEwNCip4PW4DqhHGXYMtC3K_mzOac0=',
            }}
            style={styles.noPictures}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={openCameraRoll}>
          <Image
            source={{uri: 'https://source.unsplash.com/1024x768/?boat'}}
            style={styles.noPictures}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '0%',
  },
  noPictures: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginBottom: '5%',
    opacity: 0.2,
  },
  userName: {
    fontSize: 24,
    marginBottom: 20,
  },
});
