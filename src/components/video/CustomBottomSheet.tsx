import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useMemo, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

type CustomBottomSheetProps = PropsWithChildren<{
  ref: React.RefObject<BottomSheetModalMethods>;
}>;

export default function CustomBottomSheet({ref}: CustomBottomSheetProps) {
  const snapPoints = useMemo(() => ['70%'], []);
  return (
    <BottomSheetModal ref={ref} index={0} snapPoints={snapPoints}>
      <View style={{flex: 1}}>
        <Text>Awesome!!</Text>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({});
