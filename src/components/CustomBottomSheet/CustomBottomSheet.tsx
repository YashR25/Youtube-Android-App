import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

type CustomBottomSheetProps = PropsWithChildren<{
  snapPoints: string[];
  children: React.JSX.Element;
}>;

export default React.forwardRef(
  ({snapPoints, children}: CustomBottomSheetProps, ref) => {
    return (
      <BottomSheetModal
        ref={ref as React.RefObject<BottomSheetModalMethods>}
        snapPoints={snapPoints}>
        {children}
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({});
