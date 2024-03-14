import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useState} from 'react';
import RoundedImage from '../RoundedImage';
import {commentInterface} from '../../interfaces/user';
import CustomIcon from '../CustomIcon';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {
  deleteComment,
  toggleCommentLike,
} from '../../store/slices/videoPlaybackSlice';
import {Menu} from 'react-native-paper';
import {colors} from '../../utils/theme';

type CommentItemProps = PropsWithChildren<{
  comment: commentInterface;
}>;

export default function CommentItem({comment}: CommentItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuVisble, setIsMenuVisible] = useState(false);
  const user = useSelector((state: RootState) => state.appConfigReducer.user);

  const open = () => {
    setIsMenuVisible(true);
  };
  const close = () => {
    setIsMenuVisible(false);
  };

  const likeCommentHandler = () => {
    dispatch(toggleCommentLike(comment._id));
  };

  return (
    <View style={styles.container}>
      <RoundedImage size={50} url={comment.owner.avatar} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
        }}>
        <View style={{gap: 10}}>
          <Text>{`@${comment.owner.fullName} • ${comment.updatedAt}`}</Text>
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
        {user?._id === comment.owner._id && (
          <Menu
            visible={isMenuVisble}
            onDismiss={close}
            anchor={
              <Pressable onPress={open} style={{padding: 8}}>
                <CustomIcon name="ellipsis-v" size={20} color={colors.text} />
              </Pressable>
            }>
            <Menu.Item
              title="delete"
              onPress={() => dispatch(deleteComment(comment._id))}
            />
          </Menu>
        )}
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
    gap: 10,
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
