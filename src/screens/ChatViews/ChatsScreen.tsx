import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Channel as ChannelType} from 'stream-chat';
import {ChannelList} from 'stream-chat-react-native';
import {ChatStackParamList} from '../../utils/types';
import {useChatContext} from '../../context/ChatContext';
import {auth} from '../../config/firebase';

type ChatsScreenProps = NativeStackScreenProps<
  ChatStackParamList,
  'ChatsScreen'
>;

const ChatsScreen: React.FC<ChatsScreenProps> = ({navigation}) => {
  const {currentChannel, setCurrentChannel} = useChatContext();
  const userId = auth.currentUser ? auth.currentUser.uid : '';

  const onSelect = (channel: ChannelType) => {
    setCurrentChannel(channel);
    navigation.removeListener;
    navigation.navigate('ChatRoom');
  };

  return (
    <ChannelList filters={{members: {$in: [userId]}}} onSelect={onSelect} />
  );
};

export default ChatsScreen;
