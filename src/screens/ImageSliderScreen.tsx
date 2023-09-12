import React, { useState} from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions, Text, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

type ImageProps = {
    images: string[]; 
}

const { width } = Dimensions.get('screen');
const height = width * 0.9;

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
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
    dot: {
        color: 'white',
        fontSize: 17,
    },
    activeDot: {
        color: 'black',
        fontSize: 17,
    },
    image: {
        width: width,
        height: height,
        borderRadius: 30,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 43
    }
});

export default ImageSlider;