import {
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import React, {PropsWithChildren} from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../utils/theme';

type SearchHeaderProps = PropsWithChildren<{
  onBack: () => void;
  onDescPress: () => void;
  onTextChange: (text: string) => void;
  onSearch: () => void;
}>;

export default function SearchHeader({
  onBack,
  onDescPress,
  onTextChange,
  onSearch,
}: SearchHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={{padding: 8}}>
        <FAIcon name="chevron-left" size={20} color={colors.text} />
      </Pressable>
      <TextInput
        // value={value}
        style={styles.input}
        placeholder="Search Here..."
        placeholderTextColor={colors.text}
        onChangeText={onTextChange}
        returnKeyType="search"
        onSubmitEditing={() => onSearch()}
        // onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        //   console.log(e.nativeEvent.key);
        //   if (e.nativeEvent.key === 'Enter') {
        //     Keyboard.dismiss();
        //     onSearch();
        //   }
        // }}
      />
      <Pressable style={{padding: 8}} onPress={onDescPress}>
        <FAIcon name="ellipsis-v" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 20,
    padding: 8,
    color: '#000000',
    marginHorizontal: 16,
  },
});
