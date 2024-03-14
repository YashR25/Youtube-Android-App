import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {colors} from '../../utils/theme';

type CustomBottomSheetProps = PropsWithChildren<{
  snapPoints: string[];
  children: React.JSX.Element;
}>;

export default React.forwardRef(
  ({snapPoints, children}: CustomBottomSheetProps, ref) => {
    return (
      <BottomSheetModal
        backgroundStyle={{backgroundColor: colors.background}}
        ref={ref as React.RefObject<BottomSheetModalMethods>}
        handleIndicatorStyle={{backgroundColor: colors.text}}
        snapPoints={snapPoints}
        enablePanDownToClose={true}>
        {children}
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({});
