import axios from "axios";

const API_URL = "https://userregister-be.onrender.com/";

export interface RegisterPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  try {
    const res = await axios.post(`${API_URL}/user/register`, data);
    return res.data; // { message: "Register success" }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Registration failed";
    throw new Error(message);
  }
};
