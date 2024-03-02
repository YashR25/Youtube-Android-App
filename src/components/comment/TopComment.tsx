import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getVideoComments} from '../../store/slices/videoPlaybackSlice';
import {AppDispatch, RootState} from '../../store/store';
import {commentInterface} from '../../interfaces/user';
import {colors} from '../../utils/theme';

type TopCommentProps = PropsWithChildren<{
  videoId: string | undefined;
  onPress: () => void;
}>;

export default function TopComment({videoId, onPress}: TopCommentProps) {
  const comments = useSelector(
    (state: RootState) => state.videoReducer.comments,
  );

  if (!comments) {
    return;
  }

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Comments</Text>
        <Text style={styles.commentsCount}>{comments.length}</Text>
      </View>
      {comments.length > 0 && (
        <View style={styles.commentContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={{uri: comments[0]?.owner.avatar}}
            />
          </View>
          <View>
            <Text style={styles.userName}>{comments[0]?.owner.fullName}</Text>
            <Text>{comments[0]?.content}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    borderRadius: 20,
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    color: colors.text,
  },
  commentsCount: {
    color: colors.text,
  },
  commentContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
