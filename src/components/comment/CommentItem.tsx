import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import RoundedImage from '../RoundedImage';
import {commentInterface} from '../../interfaces/user';
import CustomIcon from '../CustomIcon';

type CommentItemProps = PropsWithChildren<{
  comment: commentInterface;
}>;

export default function CommentItem({comment}: CommentItemProps) {
  return (
    <View style={styles.container}>
      <RoundedImage size={20} url={comment.owner.avatar} />
      <View>
        <Text>{`@${comment.owner.username} • ${comment.updatedAt}`}</Text>
        <Text>{comment.content}</Text>
        <View style={styles.iconContainer}>
          <View style={styles.likesContainer}>
            <CustomIcon name="thumbs-o-up" size={20} color="white" />
            <CustomIcon name="thumbs-o-down" size={20} color="white" />
          </View>
          <CustomIcon name="comment" size={20} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
