// AuthForm.tsx
import React, {useEffect} from 'react';
import {
  useForm,
  Controller,
  FieldError,
  SubmitErrorHandler,
  FieldErrors,
} from 'react-hook-form';
import {
  TextInput,
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from 'react-native';
import * as yup from 'yup';
import {colors} from '../../utils/theme';
import axios from 'axios';
import {BACKEND_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';
import Config from 'react-native-config';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const validationSchema = yup.object().shape({
  username: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
});

console.log(BACKEND_URL);

interface AuthFormProps {
  isLogin: boolean;
  onSwitchForm: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({isLogin, onSwitchForm}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: require('@hookform/resolvers/yup').yupResolver(validationSchema),
  });

  const {setAuthToken} = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      const url = `${BACKEND_URL}/api/v1/user/login`;
      const res = await axios.post(url, data);
      console.log(res);
      const accessToken = res.data.accessToken;
      setAuthToken(accessToken);
    } catch (error) {
      console.log(error);
    }

    // Perform authentication logic here based on isLogin flag
  };

  const onInvalid = (errors: FieldErrors<FormData>) => {
    console.log(errors);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      imageStyle={styles.bgImage}
      style={styles.bg}
      source={require('../../assets/background.jpg')}>
      <View style={styles.container}>
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({field}) => (
                <TextInput
                  style={[styles.input, errors.username && styles.errorStyle]}
                  placeholder="Username"
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
              name="username"
              rules={{required: true}}
            />
            <Text style={styles.errorText}>{errors.username?.message}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            render={({field}) => (
              <TextInput
                style={[styles.input, errors.email && styles.errorStyle]}
                placeholder="Email"
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
            name="email"
            rules={{required: true}}
          />
          <Text style={styles.errorText}>{errors.email?.message}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            render={({field}) => (
              <TextInput
                style={[styles.input, errors.password && styles.errorStyle]}
                placeholder="Password"
                secureTextEntry
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
            name="password"
            rules={{required: true}}
          />
          <Text style={styles.errorText}>{errors.password?.message}</Text>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit, onInvalid)}
          style={styles.button}>
          <Text style={styles.buttonText}>
            {isLogin ? 'Login' : 'Register'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.switchText} onPress={onSwitchForm}>
          {isLogin
            ? "Don't have an account? Register here"
            : 'Already have an account? Login here'}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  input: {
    padding: 10,
    borderColor: colors.gray,
    borderRadius: 12,
    backgroundColor: colors.gray,
    marginBottom: 5,
  },
  errorText: {
    color: colors.primary,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    textAlign: 'center',
  },
  switchText: {
    marginTop: 10,
    color: colors.text,
    textDecorationLine: 'underline',
  },
  errorStyle: {
    borderColor: 'red',
  },
  bgImage: {
    opacity: 0.2,
  },
  bg: {
    flex: 1,
  },
});

export default AuthForm;
