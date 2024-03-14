import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BottomTabIcon from '../BottomTabIcon';
import {colors} from '../../utils/theme';
import Animated from 'react-native-reanimated';

const {width} = Dimensions.get('window');

export default function CustomBottomtab({state, descriptors, navigation}: any) {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Animated.View style={[styles.innerContainer]} key={index}>
            <Pressable
              onPress={onPress}
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <BottomTabIcon
                focused={isFocused}
                name=""
                size={20}
                color={colors.text}
                title={label}
              />
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

// <View key={index} style={[styles.innerContainer]}>
//   <Pressable
//     onPress={onPress}
//     style={{
//       backgroundColor: isFocused ? '#030D16' : '#182028',
//       borderRadius: 20,
//     }}>
//     <View
//       style={{
//         justifyContent: 'center',
//         alignItems: 'center',
//         flex: 1,
//         padding: 15,
//       }}>
//       {tabBarIcon}
//     </View>
//   </Pressable>
// </View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.background,
    borderTopColor: colors.gray,
    borderWidth: 1,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
