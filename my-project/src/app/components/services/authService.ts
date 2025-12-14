import api from "../lib/axios";
import { setToken } from "../lib/token";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const res = await api.post("/login", data);
  setToken(res.data.token); // حفظ التوكن بعد تسجيل الدخول
  return res.data; // { user, token }
};
