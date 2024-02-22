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
      <Pressable onPress={onBack}>
        <FAIcon name="chevron-left" size={20} color={colors.text} />
      </Pressable>
      <TextInput
        style={styles.input}
        placeholder="Search Here..."
        placeholderTextColor={colors.text}
        onChangeText={onTextChange}
        onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
          if (e.nativeEvent.key === 'Enter') {
            Keyboard.dismiss();
            onSearch();
          }
        }}
      />
      <Pressable onPress={onDescPress}>
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
