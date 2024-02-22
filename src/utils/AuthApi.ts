import axios from 'axios';
import {BACKEND_URL} from '@env';

interface AuthenticateProps {
  username: string;
  email: string;
  password: string;
  mode: string;
}

const authenticate = async ({
  username,
  email,
  password,
  mode,
}: AuthenticateProps) => {
  const url = `${BACKEND_URL}/api/v1/user/${mode}`;
  const response = await axios.post(url, {email, password});
};
