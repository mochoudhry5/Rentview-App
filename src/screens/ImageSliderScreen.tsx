import React, { useState} from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions, Text, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

const { width } = Dimensions.get('screen');
const height = width * 0.9;
type ImageProps = {
    images: string[]; 
}

const ImageSlider: React.FC<ImageProps> = ( { images }) => {
    const [active, setActive] = useState(0);

    const onScrollChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slide = Math.ceil(
            event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width,
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
                style={{ width: width, height}}>
                {images.map((image : string, index : number) => (
                    <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.image}
                    />
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {images.map((k : React.Key) => (
                    <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
                        ○
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        alignSelf: 'center',
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
    }
});

export default ImageSlider;