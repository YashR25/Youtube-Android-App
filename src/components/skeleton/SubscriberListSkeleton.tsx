import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {colors} from '../../utils/theme';

type SubscriberListSkeletonProps = PropsWithChildren<{
  size: number;
}>;

export default function SubscriberListSkeleton({
  size,
}: SubscriberListSkeletonProps) {
  return (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      horizontal
      renderItem={() => {
        return (
          <View style={styles.container}>
            <View style={styles.profile} />
            <View style={styles.text} />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.gray,
  },
  text: {
    width: 40,
    height: 10,
    backgroundColor: colors.gray,
    marginVertical: 8,
  },
});
