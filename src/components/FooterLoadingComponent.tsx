import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/theme';

export default function FooterLoadingComponent() {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}>
      <Text style={{color: colors.text}}>FooterLoadingComponent</Text>
      <ActivityIndicator color={colors.text} size={50} />
    </View>
  );
}

const styles = StyleSheet.create({});
