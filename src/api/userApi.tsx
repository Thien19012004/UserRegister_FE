import api from './apiClient';

export interface RegisterPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  try {
    const res = await api.post('/user/register', data);
    return res.data; // { message: "Register success" }
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    // api has withCredentials: true, so refresh cookie will be set
    const res = await api.post('/auth/login', data);
    return res.data; // { accessToken }
  } catch (error: any) {
    // Re-throw original error so callers can read status/message
    throw error;
  }
};

export const refreshAccessToken = async () => {
  const res = await api.post('/auth/refresh');
  return res.data; // { accessToken }
};
