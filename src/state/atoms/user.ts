import { atom, useAtom } from "jotai";
import { pb } from "@/settings.js";
import { AuthRecord } from "pocketbase";

const userAtom = atom<AuthRecord | null>(pb.authStore.record);

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);

  const login = async (email: string, password: string) => {
    const authData = await pb.collection("users").authWithPassword(email, password);
    setUser(authData.record)
  };
  const update = (authData: AuthRecord) => {
    setUser(authData)
  }
  const logout = () => {
    pb.authStore.clear()
    setUser(null);
  }

  const refresh = async () => {
    const authData = await pb.collection("users").authRefresh()
    setUser(authData.record)
  }

  const changePassword = async (oldPassword: string, password: string, passwordConfirm: string) => {
    if (!user?.id)
      throw Error("You need to be logged in to change your password!")

    const data = { oldPassword, password, passwordConfirm };

    await pb.collection('users').update(user?.id, data);

    logout()
  }

  const requestOTP = async (email: string) => {
    // send OTP email to the provided auth record
    const req = await pb.collection('users').requestOTP(email);

    return req.otpId
  }
  const authWithOTP = async (otpId: string, otp: string) => {
    const authData = await pb.collection('users').authWithOTP(
      otpId,
      otp,
    );
    
    setUser(authData.record)
  }

  const isAuthenticated = () => {
    return pb.authStore.record?.id && pb.authStore.isValid
  }
  
  const isTokenExpired = (jwt_token?: string) => {
    const token = pb.authStore.token ?? jwt_token

    if (!token) return true; // No token means it's expired or invalid

    try {
        const payloadBase64 = token.split('.')[1]; // Extract payload
        const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode JSON
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        return decodedPayload.exp < currentTime; // Compare expiration
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Treat invalid tokens as expired
    }

  }

  return { user, login, logout, refresh, update, changePassword, requestOTP, authWithOTP, isAuthenticated, authStore: pb.authStore, isTokenExpired };
};