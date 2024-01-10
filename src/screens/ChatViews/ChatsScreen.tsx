import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Channel as ChannelType} from 'stream-chat';
import {ChannelList} from 'stream-chat-react-native';
import {ChatStackParamList} from '../../utils/types';
import {useChatContext} from '../../context/ChatContext';

type ChatsScreenProps = NativeStackScreenProps<
  ChatStackParamList,
  'ChatsScreen'
>;

const ChatsScreen: React.FC<ChatsScreenProps> = ({navigation}) => {
  const {currentChannel, setCurrentChannel} = useChatContext();

  const onSelect = (channel: ChannelType) => {
    setCurrentChannel(channel);
    navigation.removeListener;
    navigation.navigate('ChatRoom');
  };

  return <ChannelList onSelect={onSelect} />;
};

export default ChatsScreen;
