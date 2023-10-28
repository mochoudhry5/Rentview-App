import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const ChatScreen = () => {
  return (
    <View style={styles.noReviewsView}>
      <Text style={{fontSize: 25}}>No Messages</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  noReviewsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
});
