import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import RoundedImage from '../RoundedImage';
import {commentInterface} from '../../interfaces/user';
import CustomIcon from '../CustomIcon';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {toggleCommentLike} from '../../store/slices/videoPlaybackSlice';

type CommentItemProps = PropsWithChildren<{
  comment: commentInterface;
}>;

export default function CommentItem({comment}: CommentItemProps) {
  const dispatch = useDispatch<AppDispatch>();

  const likeCommentHandler = () => {
    dispatch(toggleCommentLike(comment._id));
  };

  return (
    <View style={styles.container}>
      <RoundedImage size={50} url={comment.owner.avatar} />
      <View style={{gap: 10}}>
        <Text>{`@${comment.owner.username} • ${comment.updatedAt}`}</Text>
        <Text>{comment.content}</Text>
        <View style={styles.iconContainer}>
          <View style={styles.likesContainer}>
            <Pressable onPress={likeCommentHandler}>
              <CustomIcon
                name={comment.isLiked ? 'thumbs-up' : 'thumbs-o-up'}
                size={20}
                color="white"
              />
            </Pressable>
            <CustomIcon name="thumbs-o-down" size={20} color="white" />
          </View>
          {/* <CustomIcon name="comment" size={20} color="white" /> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  likesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});
