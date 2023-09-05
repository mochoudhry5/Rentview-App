import React, { useState} from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions, Text, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

type ImageProps = {
    images: string[]; 
}

const { width } = Dimensions.get('screen');
const height = width * 0.8;

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
                style={{ width: 415, height }}>
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
                        •
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
        bottom: -15,
        alignSelf: 'center',
    },
    dot: {
        color: '#888',
        fontSize: 50,
    },
    activeDot: {
        color: '#FFF',
        fontSize: 50,
    },
    image: {
        width: 415,
        height: height,
        marginTop: 55,
        marginLeft: 13,
        borderRadius: 15,
    }
});

export default ImageSlider;