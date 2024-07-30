import axios from 'axios';
import { baseURL } from './constant';

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${baseURL}auth/validate-token`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};