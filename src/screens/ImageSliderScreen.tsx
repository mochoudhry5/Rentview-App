import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('screen');
const height = width * 0.9;
type ImageProps = {
  images: string[];
};

const ImageSlider: React.FC<ImageProps> = ({images}) => {
  const [active, setActive] = useState(0);

  const onScrollChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  return (
    <View>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={{width: width, height}}>
        {images.map((image) => (
          <Image key={image} source={{uri: image}} style={styles.image}/>
        ))}
      </ScrollView>
      <View style={styles.backButton}>
          <TouchableOpacity style={styles.roundButton1}>
            <Icon name={"chevron-back-outline"} color="black" size={28} />
          </TouchableOpacity>
      </View>
      <View style={styles.claimButton}>
        <TouchableOpacity style={styles.roundButton1}>
              <Text>Claim Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position:'absolute',
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    width:width,
    paddingTop:'15%',
    paddingLeft:'5%',
    zIndex:2
  },
  claimButton: {
    position:'absolute',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    width:width,
    paddingTop:'15%',
    paddingRight:'5%',
    zIndex:2
  },
  dot: {
    color: 'white',
    fontSize: 13,
  },
  activeDot: {
    color: 'black',
    fontSize: 13,
  },
  image: {
    width: width,
    height: height,
    borderColor: 'black',
    borderWidth: 1,
  },
  roundButton1: {
    borderRadius: 50,
    padding:'2%',
    backgroundColor: '#D3D3D3',
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageSlider;
