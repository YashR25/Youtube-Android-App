import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import CommonIcon from '../CommonIcon';
import Profile from '../channel/Profile';
import {useSelector} from 'react-redux';
import {colors} from '../../utils/theme';
import {RootState} from '../../store/store';
import {userInterface} from '../../interfaces/user';
import HeaderSkeletom from '../skeleton/HeaderSkeletom';

type HeaderProps = PropsWithChildren<{
  onSearch: () => void;
  onProfile: () => void;
}>;

export default function Header({onSearch, onProfile}: HeaderProps) {
  const currentUser = useSelector(
    (state: RootState) => state.appConfigReducer.user,
  );
  if (!currentUser) {
    return <HeaderSkeletom />;
  }

  return (
    <View style={styles.container}>
      <CommonIcon
        name="search"
        size={20}
        onPress={onSearch}
        color={colors.text}
      />
      <Profile onPress={onProfile} size={40} url={currentUser?.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
});
