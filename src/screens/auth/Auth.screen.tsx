import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AuthForm from '../../components/auth/AuthForm';
import {colors} from '../../utils/theme';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const switchForm = () => {
    setIsLogin(prevIsLogin => !prevIsLogin);
  };

  return (
    <View style={styles.container}>
      <AuthForm isLogin={isLogin} onSwitchForm={switchForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
