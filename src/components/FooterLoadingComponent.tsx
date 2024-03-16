import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/theme';

export default function FooterLoadingComponent() {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator color={colors.text} size={50} />
    </View>
  );
}

const styles = StyleSheet.create({});
