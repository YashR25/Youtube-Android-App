import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import CustomIcon from '../CustomIcon';
import {colors} from '../../utils/theme';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {addVideoComment} from '../../store/slices/videoPlaybackSlice';

type CommentFormProps = PropsWithChildren<{
  videoId: string;
}>;

export default function CommentForm({videoId}: CommentFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const submitHandler = () => {
    if (comment.length <= 0) {
      Alert.alert('Comment required!!', 'Comment cannnot be empty!!');
      return;
    }
    dispatch(addVideoComment({videoID: videoId, comment: comment}));
  };
  const [comment, setComment] = useState<string>('');
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
      />
      <Pressable onPress={submitHandler}>
        <CustomIcon name="send-o" size={20} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.gray,
    color: colors.text,
  },
  btn: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
