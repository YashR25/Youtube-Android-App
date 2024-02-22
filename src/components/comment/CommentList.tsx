import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {commentInterface} from '../../interfaces/user';
import CommentItem from './CommentItem';

type CommentListProps = PropsWithChildren<{
  comments: [commentInterface] | [];
}>;

export default function CommentList({comments}: CommentListProps) {
  return (
    <FlatList
      data={comments}
      renderItem={({item, index}) => <CommentItem comment={item} />}
      style={{padding: 8}}
    />
  );
}

const styles = StyleSheet.create({});
